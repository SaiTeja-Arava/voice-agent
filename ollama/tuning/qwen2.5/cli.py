#!/usr/bin/env python3
import argparse
import os
import sys
import readline
from typing import Optional, List
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TextIteratorStreamer
from threading import Thread
import warnings

# Suppress warning messages
warnings.filterwarnings("ignore")

class Colors:
    BLUE = "\033[94m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"

def print_colored(text: str, color: str):
    """Print text with color."""
    print(f"{color}{text}{Colors.ENDC}")

class HuggingFaceCLI:
    def __init__(
        self, 
        model_name: str, 
        device: str = None,
        max_new_tokens: int = 512,
        temperature: float = 0.7,
        top_p: float = 0.9,
        repetition_penalty: float = 1.1,
        load_in_8bit: bool = False,
        load_in_4bit: bool = False,
    ):
        """Initialize the CLI with a specified Hugging Face model."""
        self.model_name = model_name
        self.max_new_tokens = max_new_tokens
        self.temperature = temperature
        self.top_p = top_p
        self.repetition_penalty = repetition_penalty
        
        # Determine the best device - for macOS, force CPU to avoid MPS issues
        if device and device != "auto":
            self.device = device
        else:
            # On Mac, we'll default to CPU unless explicitly asked for MPS
            if torch.backends.mps.is_available() and device == "mps":
                self.device = "mps"
            elif torch.cuda.is_available() and device != "cpu":
                self.device = "cuda"
            else:
                self.device = "cpu"
        
        print_colored(f"Initializing with model: {model_name}", Colors.BLUE)
        print_colored(f"Using device: {self.device}", Colors.BLUE)
        
        # Load tokenizer
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        except Exception as e:
            print_colored(f"Error loading tokenizer: {str(e)}", Colors.RED)
            raise e
        
        # Prepare model loading kwargs
        model_kwargs = {}
        if self.device == "cpu":
            # For CPU, don't use device_map to avoid issues
            model_kwargs["torch_dtype"] = torch.float32
        else:
            # For GPU devices
            model_kwargs["device_map"] = "auto"
            model_kwargs["torch_dtype"] = torch.float16 if self.device != "cpu" else torch.float32
            
        # Add quantization if requested
        if load_in_8bit:
            model_kwargs["load_in_8bit"] = True
        elif load_in_4bit:
            model_kwargs["load_in_4bit"] = True
        
        # Load model with appropriate settings
        try:
            print_colored("Loading model (this may take a while)...", Colors.YELLOW)
            self.model = AutoModelForCausalLM.from_pretrained(model_name, **model_kwargs)
            
            # If using CPU, explicitly move model to CPU to avoid any MPS issues
            if self.device == "cpu":
                self.model = self.model.to("cpu")
                
            print_colored("Model loaded successfully!", Colors.GREEN)
        except Exception as e:
            print_colored(f"Error loading model: {str(e)}", Colors.RED)
            print_colored("Falling back to CPU with minimal settings...", Colors.YELLOW)
            self.device = "cpu"
            try:
                self.model = AutoModelForCausalLM.from_pretrained(
                    model_name,
                    torch_dtype=torch.float32,
                    low_cpu_mem_usage=True
                ).to("cpu")
                print_colored("Model loaded successfully with fallback settings!", Colors.GREEN)
            except Exception as e2:
                print_colored(f"Fatal error loading model: {str(e2)}", Colors.RED)
                raise e2
    
    def generate(self, prompt: str) -> str:
        """Generate a response based on the prompt."""
        try:
            # Tokenize inputs and explicitly move to the correct device
            inputs = self.tokenizer(prompt, return_tensors="pt")
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Setup streamer
            streamer = TextIteratorStreamer(self.tokenizer, skip_prompt=True, skip_special_tokens=True)
            
            # Generation parameters
            gen_kwargs = {
                "input_ids": inputs["input_ids"],
                "attention_mask": inputs["attention_mask"],
                "max_new_tokens": self.max_new_tokens,
                "temperature": self.temperature,
                "top_p": self.top_p,
                "repetition_penalty": self.repetition_penalty,
                "streamer": streamer,
                "do_sample": self.temperature > 0,
            }
            
            # Start generation in a separate thread to enable streaming
            thread = Thread(target=self.model.generate, kwargs=gen_kwargs)
            thread.start()
            
            # Print the response token by token as it's generated
            print_colored("\nModel:", Colors.GREEN)
            generated_text = ""
            for text in streamer:
                print(text, end="", flush=True)
                generated_text += text
            print("\n")
            
            thread.join()
            return generated_text
            
        except Exception as e:
            print_colored(f"Error during generation: {str(e)}", Colors.RED)
            return f"[Error generating response: {str(e)}]"
    
    def interactive_mode(self):
        """Start an interactive CLI session."""
        print_colored("\n=== Interactive Mode ===", Colors.YELLOW)
        print_colored("Type 'exit', 'quit', or press Ctrl+C to exit", Colors.YELLOW)
        print_colored("Type 'clear' to clear the conversation history", Colors.YELLOW)
        
        conversation_history = ""
        
        while True:
            try:
                # Get user input with proper line wrapping
                print_colored("\nYou:", Colors.BLUE)
                user_input = input()
                
                if user_input.lower() in ["exit", "quit"]:
                    print_colored("Exiting interactive mode...", Colors.YELLOW)
                    break
                elif user_input.lower() == "clear":
                    conversation_history = ""
                    print_colored("Conversation history cleared!", Colors.YELLOW)
                    continue
                
                # Create the full prompt for the model
                if conversation_history:
                    full_prompt = f"{conversation_history}\nUser: {user_input}\nAssistant: "
                else:
                    full_prompt = f"User: {user_input}\nAssistant: "
                
                # Generate and display response
                response = self.generate(full_prompt)
                
                # Update conversation history (only if we got a valid response)
                if not response.startswith("[Error"):
                    conversation_history = full_prompt + response
                
            except KeyboardInterrupt:
                print_colored("\nExiting interactive mode...", Colors.YELLOW)
                break
            except Exception as e:
                print_colored(f"\nError: {str(e)}", Colors.RED)
                print_colored("Try again or type 'exit' to quit", Colors.YELLOW)

def main():
    parser = argparse.ArgumentParser(description="HuggingFace Local LLM CLI")
    parser.add_argument("--model", type=str, default="Qwen/Qwen2.5-0.5B", 
                        help="Hugging Face model name or path (default: Qwen/Qwen2.5-0.5B)")
    parser.add_argument("--device", type=str, default="cpu", 
                        help="Device to use (options: cpu, cuda, mps, auto) (default: cpu)")
    parser.add_argument("--max-tokens", type=int, default=512, 
                        help="Maximum number of new tokens to generate (default: 512)")
    parser.add_argument("--temperature", type=float, default=0.7, 
                        help="Temperature for sampling (default: 0.7)")
    parser.add_argument("--top-p", type=float, default=0.9, 
                        help="Top-p sampling parameter (default: 0.9)")
    parser.add_argument("--repetition-penalty", type=float, default=1.1, 
                        help="Repetition penalty (default: 1.1)")
    parser.add_argument("--8bit", dest="load_in_8bit", action="store_true", 
                        help="Load model in 8-bit precision")
    parser.add_argument("--4bit", dest="load_in_4bit", action="store_true", 
                        help="Load model in 4-bit precision")
    parser.add_argument("--prompt", type=str, 
                        help="Single prompt to run (non-interactive mode)")
    
    args = parser.parse_args()
    
    try:
        # Initialize the CLI
        cli = HuggingFaceCLI(
            model_name=args.model,
            device=args.device,
            max_new_tokens=args.max_tokens,
            temperature=args.temperature,
            top_p=args.top_p,
            repetition_penalty=args.repetition_penalty,
            load_in_8bit=args.load_in_8bit,
            load_in_4bit=args.load_in_4bit,
        )
        
        # Check if a single prompt was provided
        if args.prompt:
            cli.generate(f"User: {args.prompt}\nAssistant: ")
        else:
            # Start interactive mode
            cli.interactive_mode()
    
    except KeyboardInterrupt:
        print_colored("\nOperation interrupted by user.", Colors.YELLOW)
    except Exception as e:
        print_colored(f"\nError: {str(e)}", Colors.RED)
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())