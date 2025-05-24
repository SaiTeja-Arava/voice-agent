# mlx_lm.fuse \
#   --model Qwen/Qwen2.5-0.5B \
#   --adapter-path /Users/saitejaarava/Documents/playground/arena/test/voice-agent/ollama/tuning/qwen2.5/tool_calling_adapters \
#   --save-path ./qwen2.5:0.5b_tuned_1 \
#   --export-gguf \
#   --gguf-path /Users/saitejaarava/Documents/playground/arena/test/voice-agent/ollama/tuning/qwen2.5:0.5b_tuned_1/models/v2.gguf

mlx_lm.fuse \
  --model Qwen/Qwen2.5-0.5B \
  --adapter-path /Users/saitejaarava/Documents/playground/arena/test/voice-agent/ollama/tuning/qwen2.5/tool_calling_adapters \
  --save-path ./qwen2.5:0.5b_tuned_1 

  cd llama.cpp && python3 convert_hf_to_gguf.py ../qwen2.5:0.5b_tuned_1 --outfile ../qwen2.5:0.5b_tuned_1/models/v1.gguf --outtype f16