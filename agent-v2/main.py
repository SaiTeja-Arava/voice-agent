import sys
import json
import argparse
from colorama import Fore, Style, init
import torch
from models.llm import LocalQwenLLM, DeviceType
from tools.calculator import Calculator
from tools.weather import WeatherTool

def main():
    """Main entry point for the CLI assistant."""
    init(autoreset=True)  # Initialize colorama
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Local Qwen2.5 CLI Assistant with Tools')
    parser.add_argument('--model', default='Qwen/Qwen2.5-0.5B-Instruct', 
                        help='Model name to use')
    parser.add_argument('--device', default='auto', 
                        choices=['auto', 'cpu', 'cuda', 'mps'], 
                        help='Device to run on (auto, cpu, cuda, mps)')
    parser.add_argument('--use-mps', action='store_true', 
                        help='Force using MPS acceleration for Apple Silicon Macs')
    parser.add_argument('--max-tokens', type=int, default=512, 
                        help='Maximum number of tokens to generate')
    parser.add_argument('--temperature', type=float, default=0.7, 
                        help='Temperature for sampling (0.0-1.0)')
    args = parser.parse_args()
    
    # Check for Apple Silicon and provide information
    if torch.backends.mps.is_available():
        print(f"{Fore.GREEN}Apple Silicon detected! MPS acceleration is available.{Style.RESET_ALL}")
        if not args.use_mps and args.device == 'auto':
            print(f"{Fore.YELLOW}Tip: Use --use-mps flag to enable GPU acceleration on your Mac.{Style.RESET_ALL}")
    
    print(f"{Fore.CYAN}Initializing Local Qwen2.5 CLI Assistant...{Style.RESET_ALL}")
    
    try:
        # Initialize the model with proper device handling
        device = DeviceType.from_string(args.device)
        
        # Provide feedback about memory requirements
        if device == DeviceType.MPS or device == DeviceType.CUDA:
            model_size = args.model.lower()
            if "72b" in model_size:
                print(f"{Fore.RED}Warning: 72B model requires around 140GB of GPU memory.{Style.RESET_ALL}")
            elif "32b" in model_size or "30b" in model_size:
                print(f"{Fore.RED}Warning: 32B model requires around 60GB of GPU memory.{Style.RESET_ALL}")
            elif "14b" in model_size or "13b" in model_size:
                print(f"{Fore.YELLOW}Note: 14B model requires around 28GB of GPU memory.{Style.RESET_ALL}")
            elif "7b" in model_size:
                print(f"{Fore.YELLOW}Note: 7B model requires around 14GB of GPU memory.{Style.RESET_ALL}")
        
        # Initialize LLM with proper device settings
        llm = LocalQwenLLM(
            model_name=args.model, 
            device=device, 
            use_mps=args.use_mps
        )
        
        # Initialize tools
        tools = [Calculator(), WeatherTool()]
        
        # Create tools lookup dictionary
        tools_dict = {tool.name: tool for tool in tools}
        
        # Start message
        print(f"{Fore.GREEN}Assistant is ready! Type 'exit' to quit.{Style.RESET_ALL}")
        print(f"{Fore.CYAN}Running on: {llm.device} | Model: {args.model}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Available tools: {', '.join(tools_dict.keys())}{Style.RESET_ALL}")
        print("-" * 60)
        
        # Start conversation history
        conversation = [{"role": "system", "content": "You are a helpful assistant with the ability to use tools."}]
        
        while True:
            # Get user input
            user_input = input(f"{Fore.BLUE}You: {Style.RESET_ALL}")
            
            # Check for exit command
            if user_input.lower() in ['exit', 'quit', 'bye']:
                print(f"{Fore.CYAN}Assistant: Goodbye!{Style.RESET_ALL}")
                break
            
            # Add user message to conversation
            conversation.append({"role": "user", "content": user_input})
            
            # Get response from assistant
            print(f"{Fore.GREEN}Assistant: {Style.RESET_ALL}", end='')
            
            try:
                # Generate response
                response = llm.generate_response(
                    conversation, 
                    tools=tools,
                    max_new_tokens=args.max_tokens
                )
                print(response)
                
                # Check for tool calls
                tool_calls = llm.extract_tool_calls(response)
                
                # Process tool calls if any
                if tool_calls:
                    for call in tool_calls:
                        tool_name = call.get("name")
                        arguments = call.get("arguments")
                        
                        if tool_name in tools_dict:
                            print(f"\n{Fore.YELLOW}Executing tool: {tool_name}{Style.RESET_ALL}")
                            
                            # Parse arguments (could be string or dict)
                            if isinstance(arguments, str):
                                try:
                                    args_dict = json.loads(arguments)
                                except json.JSONDecodeError:
                                    print(f"{Fore.RED}Error: Could not parse arguments: {arguments}{Style.RESET_ALL}")
                                    continue
                            else:
                                args_dict = arguments
                            
                            # Execute the tool
                            try:
                                tool_result = tools_dict[tool_name].execute(**args_dict)
                                print(f"{Fore.GREEN}Result: {tool_result}{Style.RESET_ALL}")
                                
                                # Add tool result to conversation
                                conversation.append({
                                    "role": "assistant",
                                    "content": response
                                })
                                conversation.append({
                                    "role": "user",
                                    "content": f"Tool {tool_name} returned: {tool_result}"
                                })
                                
                                # Get final response after tool execution
                                final_response = llm.generate_response(
                                    conversation, 
                                    tools=tools,
                                    max_new_tokens=args.max_tokens
                                )
                                print(f"\n{Fore.GREEN}Assistant: {final_response}{Style.RESET_ALL}")
                                
                                # Update conversation
                                conversation.append({
                                    "role": "assistant",
                                    "content": final_response
                                })
                            except Exception as e:
                                print(f"{Fore.RED}Error executing tool: {str(e)}{Style.RESET_ALL}")
                        else:
                            print(f"{Fore.RED}Unknown tool: {tool_name}{Style.RESET_ALL}")
                else:
                    # Just add the response to conversation
                    conversation.append({
                        "role": "assistant",
                        "content": response
                    })
            except Exception as e:
                print(f"\n{Fore.RED}Error: {str(e)}{Style.RESET_ALL}")
                
                # Print exception traceback for debugging
                import traceback
                print(f"{Fore.RED}{traceback.format_exc()}{Style.RESET_ALL}")
            
            print("\n" + "-" * 60)
    
    except Exception as e:
        print(f"{Fore.RED}Failed to initialize the assistant: {str(e)}{Style.RESET_ALL}")
        # Print exception traceback for debugging
        import traceback
        print(f"{Fore.RED}{traceback.format_exc()}{Style.RESET_ALL}")
        return

def check_system_compatibility():
    """Check and print system compatibility information."""
    print(f"{Fore.CYAN}System Compatibility Check:{Style.RESET_ALL}")
    
    # Check Python version
    python_version = sys.version.split()[0]
    print(f"Python Version: {python_version}")
    
    # Check PyTorch version and availability
    torch_version = torch.__version__
    print(f"PyTorch Version: {torch_version}")
    
    # Check CUDA availability
    cuda_available = torch.cuda.is_available()
    cuda_version = torch.version.cuda if cuda_available else "N/A"
    print(f"CUDA Available: {cuda_available} (Version: {cuda_version})")
    
    if cuda_available:
        gpu_count = torch.cuda.device_count()
        print(f"GPU Count: {gpu_count}")
        for i in range(gpu_count):
            gpu_name = torch.cuda.get_device_name(i)
            print(f"  GPU {i}: {gpu_name}")
    
    # Check MPS (Apple Silicon) availability
    mps_available = torch.backends.mps.is_available()
    print(f"MPS (Apple Silicon) Available: {mps_available}")
    
    if mps_available:
        print(f"{Fore.GREEN}✓ Your Mac supports GPU acceleration via MPS{Style.RESET_ALL}")
    
    # Check available RAM
    try:
        import psutil
        ram_gb = round(psutil.virtual_memory().total / (1024**3), 2)
        print(f"System RAM: {ram_gb} GB")
        
        # Memory recommendations
        if ram_gb < 8:
            print(f"{Fore.RED}Warning: Less than 8GB RAM may be insufficient for running LLMs{Style.RESET_ALL}")
        elif ram_gb < 16:
            print(f"{Fore.YELLOW}Note: For 7B models, 16GB RAM is recommended{Style.RESET_ALL}")
        else:
            print(f"{Fore.GREEN}✓ RAM is sufficient for running smaller models{Style.RESET_ALL}")
    except ImportError:
        print("RAM check skipped (psutil not installed)")
    
    print("-" * 60)

if __name__ == "__main__":
    # Run system compatibility check before starting
    check_system_compatibility()
    main()