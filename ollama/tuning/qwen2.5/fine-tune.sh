echo "Starting fine-tuning process..."
mlx_lm.lora \
    --model Qwen/Qwen2.5-0.5B \
    --train \
    --data /Users/saitejaarava/Documents/playground/arena/test/voice-agent/ollama/tuning/data.bkp \
    --adapter-path /Users/saitejaarava/Documents/playground/arena/test/voice-agent/ollama/tuning/qwen2.5/tool_calling_adapters \
    --iters 500 \
    --batch-size 2\
    --num-layers 8\
    --steps-per-eval 100 \
    --max-seq-length 5632

# python -m mlx_lm.lora \
#    --resume-adapter-file /Users/saitejaarava/Documents/playground/arena/test/voice-agent/ollama/tuning/qwen2.5/tool_calling_adapters \
#     --model Qwen/Qwen2.5-0.5B-Instruct \
#     --train \
#     --data /Users/saitejaarava/Documents/playground/arena/test/voice-agent/ollama/tuning/data \
#     --batch-size 4 \
#     --num-layers 8 \
#     --adapter-path /Users/saitejaarava/Documents/playground/arena/test/voice-agent/ollama/tuning/qwen2.5/tool_calling_adapters \
#     --iters 100 \
#     --val-batches 20 \
#     --steps-per-eval 100 \
#     --learning-rate 1e-4 \
#     --save-every 200