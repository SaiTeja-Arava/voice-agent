<script lang="ts">
    import { onMount } from "svelte";
    import {
        initAudioSystem,
        isRecording,
        playBufferedAudio,
        startRecording,
        stopRecording,
        transcribedText,
    } from "./audio";

    let listening = false;

    // Add event listeners for spacebar press and release
    document.addEventListener("keydown", (event) => {
        // console.log(isRecording, event)
        // Check if the pressed key is the spacebar (keyCode 32)
        if (event.key === " " && !isRecording) {
            // Prevent the default spacebar action (scrolling)
            event.preventDefault();
            // console.log("starting recording...")
            // Start recording
            startRecording();
            listening = true;
        }
    });

    document.addEventListener("keyup", (event) => {
        // Check if the released key is the spacebar (keyCode 32)
        if (event.key === " " && isRecording) {
            // Prevent the default spacebar action
            event.preventDefault();

            // Stop recording
            stopRecording();
            listening = false;
            // Play the buffered audio after a short delay to allow processing
        }
    });

    $:{
        if(listening){
           transcribedText.set("")
        }
    }

    onMount(() => {
        initAudioSystem();
    });
</script>

<div style="height: 100vh;width: 100vw; display:flex; align-items: center; justify-content:center;position: relative;">
    <div style="">
        <h1>
            {#if listening}
                Listening...
                {:else}
                Hold SPACE to speak
            {/if}
        </h1>
        <p style="padding-top:20px;">
            {$transcribedText}
        </p>
    </div>
</div>
