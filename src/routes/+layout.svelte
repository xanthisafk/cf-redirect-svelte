<script>
    import '../app.css';
    import { onMount } from 'svelte';
    import { Sun, Moon } from 'lucide-svelte';
    let { children, data } = $props();

    // Enforce dark mode effectively by not toggling 'light' class
</script>

<div class="min-h-screen flex flex-col font-sans transition-colors duration-300">
    <nav class="border-b transition-colors duration-300 border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <a href="/" class="text-2xl font-bold text-neon-green tracking-wider flex items-center gap-2 group">
                        <span class="inline-block animate-bounce-slow text-3xl">🛸</span> UFO
                    </a>
                </div>
                <div class="flex items-center gap-4">
                    <!-- Desktop Nav -->
                    <div class="hidden md:flex items-baseline space-x-4">
                        {#if data.user}
                            <a href="/dashboard" class="hover:text-neon-green px-3 py-2 rounded-md text-sm font-medium transition-colors text-[var(--text-secondary)]">Dashboard</a>
                            {#if data.user.role === 'admin'}
                                <a href="/command" class="hover:text-neon-green px-3 py-2 rounded-md text-sm font-medium transition-colors text-[var(--text-secondary)]">Command Center</a>
                            {/if}
                            <form action="/logout" method="POST" class="inline">
                                <button type="submit" class="hover:text-neon-green px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer text-[var(--text-secondary)]">Logout</button>
                            </form>
                        {:else}
                            <a href="/login" class="hover:text-neon-green px-3 py-2 rounded-md text-sm font-medium transition-colors text-[var(--text-secondary)]">Login</a>
                            <a href="/register" class="btn-primary text-sm">Register</a>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {@render children()}
    </main>

    <footer class="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-8 mt-auto">
        <div class="max-w-7xl mx-auto px-4 text-center space-y-2">
            <p class="text-[var(--text-secondary)] text-sm">
                Made by <span class="font-bold text-[var(--text-primary)]">abhinav</span> • <a href="https://xanthis.xyz" target="_blank" class="text-neon-green hover:underline">xanthis.xyz</a>
            </p>
            <p class="text-[var(--text-secondary)] text-xs">
                Deploy your own on <a href="https://ufo.xanthis.xyz/uforepo" target="_blank" class="text-neon-green hover:underline">GitHub</a>
            </p>
        </div>
    </footer>
</div>

<style>
    @keyframes bounce-slow {
        0%, 100% { transform: translateY(-5%); }
        50% { transform: translateY(5%); }
    }
    .animate-bounce-slow {
        animation: bounce-slow 3s infinite ease-in-out;
    }
</style>
