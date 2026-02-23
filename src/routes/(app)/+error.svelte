<script lang="ts">
	import { navigateToHomePage } from "$lib/utils/navigation";


</script>

<div class="relative flex w-full flex-col overflow-x-hidden">
    <div class="max-w-[560px] w-full flex flex-col justify-center 
        items-center text-center self-center py-8 gap-2">
        <!-- Illustration Placeholder -->
        <!-- <div class="relative mb-10 group">
            <div class="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform scale-150"></div>
            <div
                class="relative z-10 w-64 h-64 md:w-80 md:h-80 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center shadow-inner">
                <div class="flex flex-col items-center">
                    <span
                        class="material-symbols-outlined text-8xl md:text-9xl text-slate-400 dark:text-slate-600 mb-2">
                        soup_kitchen
                    </span>
                    <span
                        class="material-symbols-outlined text-5xl md:text-6xl text-primary absolute top-1/4 right-1/4 animate-bounce">
                        error
                    </span>
                    <div class="w-full flex justify-center mt-4">
                        <span
                            class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700">cloud</span>
                        <span
                            class="material-symbols-outlined text-2xl text-slate-300 dark:text-slate-700 ml-2">cloud</span>
                    </div>
                </div>
            </div>
        </div> -->
        <!-- Error Text -->
        <h1 class="text-3xl md:text-4xl font-bold text-base-content mb-4 tracking-tight">
            Oops! Something went wrong.
        </h1>
        <p class="text-lg text-base-content/60 mb-10 max-w-[480px] leading-relaxed">
            Please try refreshing the page or head back to homepage.
        </p>
        <!-- Call to Actions -->
        <div class="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
            <button class="btn btn-sm md:btn-lg btn-primary w-40 rounded-2xl text-lg font-bold shandow-lg 
                shadow-primary/20 hover:brightness-110 hover:scale-105 transition-all"
                onclick={() => location.reload()}>
                Try Again
            </button>
            <button class="btn btn-sm md:btn-lg btn-outline w-40 rounded-2xl text-lg font-bold border-base-300 
                border-1 hover:brightness-110 hover:scale-105 transition-all"
                onclick={async () => await navigateToHomePage()}>
                Go to Home
            </button>
        </div>
    </div>
</div>

