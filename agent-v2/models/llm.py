import json
import re
from enum import Enum, auto
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

class DeviceType(Enum):
    """Enum for different computation device types."""
    CPU = "cpu"
    CUDA = "cuda"
    MPS = "mps"  # Metal Performance Shaders for Apple Silicon
    AUTO = "auto"  # Automatically determine the best device
    
    @classmethod
    def detect_best_device(cls):
        """Automatically detect the best available device."""
        if torch.backends.mps.is_available():
            return cls.MPS
        elif torch.cuda.is_available():
            return cls.CUDA
        else:
            return cls.CPU
    
    @classmethod
    def from_string(cls, device_str):
        """Convert string to DeviceType enum."""
        if device_str is None or device_str.lower() == "auto":
            return cls.detect_best_device()
        
        try:
            return cls(device_str.lower())
        except ValueError:
            print(f"Warning: Unknown device '{device_str}', falling back to automatic detection")
            return cls.detect_best_device()

class LocalQwenLLM:
    """Local Qwen2.5 model with tools support using Transformers."""
    
    def __init__(self, model_name="Qwen/Qwen2.5-7B-Instruct", device="auto", use_mps=False):
        """
        Initialize a local Qwen2.5 model with Transformers.
        
        Args:
            model_name: The Qwen model to load
            device: Device to run the model on (string or DeviceType, default: "auto")
            use_mps: Whether to force using MPS on Mac (default: False)
        """
        self.model_name = model_name
        
        # Handle device specification
        if isinstance(device, DeviceType):
            self.device_type = device
        else:
            self.device_type = DeviceType.from_string(device)
        
        # Override with MPS if explicitly requested
        if use_mps and torch.backends.mps.is_available():
            self.device_type = DeviceType.MPS
        
        # Convert enum to string for PyTorch
        self.device = self.device_type.value
        
        print(f"Loading model on {self.device} device...")
        
        # Load model and tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        # Device-specific model loading
        if self.device_type == DeviceType.MPS:
            # For Apple Silicon
            print("Using Apple Silicon GPU acceleration via MPS...")
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float16,
                device_map=None,
                trust_remote_code=True,
            )
            self.model = self.model.to(self.device)
            
        elif self.device_type == DeviceType.CUDA:
            # For NVIDIA GPUs
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float16,
                device_map="auto",  # Auto-distribute across multiple GPUs if available
                trust_remote_code=True,
            )
            
        else:  # CPU
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float32,
                device_map=None,
                trust_remote_code=True,
            )
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

        print("this is message", prompt)
        
        # Tokenize input
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        
        # Generate response with device-specific optimizations
        with torch.no_grad():
            if self.device_type == DeviceType.MPS:
                # Apple Silicon optimizations
                torch.mps.empty_cache()  # Clear GPU memory before generation
                
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=max_new_tokens,
                    do_sample=True,
                    temperature=0.7,
                    top_p=0.9,
                    pad_token_id=self.tokenizer.eos_token_id
                )
                
                torch.mps.empty_cache()  # Clear GPU memory after generation
            else:
                # Standard generation for CPU/CUDA
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