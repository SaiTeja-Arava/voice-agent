import json
import re
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

class LocalQwenLLM:
    """Local Qwen2.5 model with tools support using Transformers."""
    
    def __init__(self, model_name="Qwen/Qwen2.5-7B-Instruct", device=None):
        """
        Initialize a local Qwen2.5 model with Transformers.
        
        Args:
            model_name: The Qwen model to load
            device: Device to run the model on (default: auto-detect)
        """
        self.model_name = model_name
        
        # Determine device (CPU, CUDA, etc.)
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Loading model on {self.device}...")
        
        # Load model and tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            device_map="auto" if self.device == "cuda" else None,
            trust_remote_code=True,
        )
        
        if self.device == "cpu":
            self.model = self.model.to(self.device)
        
        # Function to extract tool calls from response
        self.tool_pattern = re.compile(r'<tool_call>(.*?)</tool_call>', re.DOTALL)
    
    def generate_response(self, messages, tools=None, max_new_tokens=512):
        """
        Generate a response based on the conversation history.
        
        Args:
            messages: List of message dictionaries (role, content)
            tools: List of tool objects with name, description, parameters
            max_new_tokens: Maximum number of tokens to generate
            
        Returns:
            Generated text response
        """
        # Format tools for the model if provided
        formatted_tools = None
        if tools:
            formatted_tools = []
            for tool in tools:
                formatted_tools.append({
                    "type": "function",
                    "function": {
                        "name": tool.name,
                        "description": tool.description,
                        "parameters": tool.parameters
                    }
                })
        
        # Format input for model
        prompt = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            tools=formatted_tools
        )
        
        # Tokenize input
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        
        # Generate response
        outputs = self.model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            pad_token_id=self.tokenizer.eos_token_id
        )
        
        # Decode response
        response = self.tokenizer.decode(
            outputs[0][inputs.input_ids.shape[1]:], 
            skip_special_tokens=True
        )
        
        return response
    
    def extract_tool_calls(self, response):
        """
        Extract tool calls from the model response.
        
        Args:
            response: Text response from the model
            
        Returns:
            List of extracted tool calls or None
        """
        tool_calls = []
        
        # Check for tool call format: <tool_call>{"name": "...", "arguments": "..."}</tool_call>
        matches = self.tool_pattern.findall(response)
        
        for match in matches:
            try:
                # Parse the JSON inside the tool call tags
                tool_data = json.loads(match.strip())
                tool_calls.append({
                    "name": tool_data.get("name"),
                    "arguments": tool_data.get("arguments", {})
                })
            except json.JSONDecodeError:
                print(f"Warning: Could not parse tool call: {match}")
        
        return tool_calls if tool_calls else None