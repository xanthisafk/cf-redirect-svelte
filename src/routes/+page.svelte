<script>
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { ArrowRight, Zap, Shield, Globe, BarChart2, CheckCircle, Github, Server, Lock, Code, Database, Terminal } from 'lucide-svelte';

    let { data } = $props();
    let mode = $derived(data.promoMode || 'public');

    let visible = $state(false);
    onMount(() => {
        visible = true;
    });
</script>

<div class="overflow-hidden min-h-[90vh] flex flex-col justify-center">
    
    <!-- PRIVATE MODE: Minimal -->
    {#if mode === 'private'}
        <section class="relative flex-grow flex items-center justify-center p-4">
             <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-green/5 via-transparent to-transparent opacity-50 blur-3xl"></div>
             
             <div class="text-center space-y-8 relative z-10" in:fade={{ duration: 1000 }}>
                <h1 class="text-6xl font-bold tracking-widest text-[var(--text-primary)] glitch-effect">UFO</h1>
                <p class="text-[var(--text-secondary)] text-sm uppercase tracking-[0.5em]">Restricted Access</p>
                
                <div class="flex gap-4 justify-center pt-8">
                    <a href="/login" class="px-6 py-2 border border-[var(--border-color)] hover:border-neon-green hover:text-neon-green hover:bg-neon-green/5 transition-all rounded text-[var(--text-primary)]">Login</a>
                    <a href="/register" class="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold hover:bg-neon-green hover:text-black transition-all rounded">Register</a>
                </div>
             </div>
        </section>
    
    <!-- PUBLIC MODE: SaaS Sales Pitch -->
    {:else if mode === 'public'}
        <!-- Hero Section -->
        <section class="relative pt-20 pb-32 px-4 overflow-hidden">
            <!-- Background Elements -->
             <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-green/10 via-transparent to-transparent opacity-50 blur-3xl"></div>
            <div class="relative z-10 text-center max-w-4xl mx-auto space-y-8">
                {#if visible}
                    <div in:fly={{ y: 20, duration: 800, delay: 200 }} class="flex items-center justify-center gap-2 mb-4">
                        <span class="px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                            🚀 The Next Generation Link Shortener
                        </span>
                    </div>

                    <h1 in:fly={{ y: 30, duration: 800, delay: 400 }} class="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-[var(--text-primary)]">
                        Abduct Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400 drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">Long URLs</span>
                        <br /> Into The Void.
                    </h1>
                    
                    <p in:fly={{ y: 30, duration: 800, delay: 600 }} class="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        UFO is the fastest, most secure link management platform in the galaxy. 
                        Generate QR codes, track analytics, and manage your links with extraterrestrial efficiency.
                    </p>

                    <div in:fly={{ y: 30, duration: 800, delay: 800 }} class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <a href="/register" class="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
                            Get Started Free <ArrowRight class="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#features" class="px-8 py-4 rounded-md font-bold text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                            Explore Features
                        </a>
                    </div>
                {/if}
            </div>
        </section>

        <!-- Feature: Speed -->
        <section id="features" class="py-24 bg-[var(--bg-secondary)]/30 border-y border-[var(--border-color)]">
            <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                <div class="space-y-6">
                    <div class="w-16 h-16 bg-neon-green/10 rounded-2xl flex items-center justify-center">
                        <Zap class="text-neon-green w-8 h-8 animate-pulse" />
                    </div>
                    <h2 class="text-4xl font-bold text-[var(--text-primary)]">Light-Speed Redirects</h2>
                    <p class="text-[var(--text-secondary)] text-lg leading-relaxed">
                        Built on Cloudflare's Edge Network, your links resolve in milliseconds. 
                        No matter where your users are in the universe, they get to their destination instantly.
                    </p>
                    <a href="/register" class="inline-flex items-center text-neon-green font-bold hover:underline gap-2">Start Abducting <ArrowRight size={16}/></a>
                </div>
                <!-- Abstract Visual -->
                <div class="relative h-64 md:h-96 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl overflow-hidden flex items-center justify-center group">
                    <div class="absolute inset-0 bg-neon-green/5 group-hover:bg-neon-green/10 transition-colors"></div>
                    <Globe class="w-32 h-32 text-[var(--text-secondary)] group-hover:text-neon-green transition-colors duration-500 transform group-hover:scale-110" />
                </div>
            </div>
        </section>
        
        <!-- Feature: Security -->
        <section class="py-24 px-4 overflow-hidden">
            <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                 <div class="order-2 md:order-1 relative h-64 md:h-96 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden flex items-center justify-center group">
                    <Shield class="w-32 h-32 text-purple-500 group-hover:scale-110 transition-transform duration-500" />
                     <div class="absolute top-4 right-4 animate-bounce delay-700"><CheckCircle class="text-green-500" /></div>
                </div>
                <div class="order-1 md:order-2 space-y-6">
                    <div class="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                        <Lock class="text-purple-500 w-8 h-8" />
                    </div>
                    <h2 class="text-4xl font-bold text-[var(--text-primary)]">Enterprise-Grade Security</h2>
                    <p class="text-[var(--text-secondary)] text-lg leading-relaxed">
                        We scan every link for malware and phishing attempts. 
                        Secure your brand with custom domains and SSL encryption out of the box.
                    </p>
                    <a href="/register" class="inline-flex items-center text-purple-400 font-bold hover:underline gap-2">Secure Your Links <ArrowRight size={16}/></a>
                </div>
            </div>
        </section>

    <!-- PROMO MODE: OSS Sales Pitch -->
    {:else if mode === 'promo'}
        <!-- Hero Section -->
        <section class="relative pt-20 pb-32 px-4 overflow-hidden text-center">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50 blur-3xl"></div>
            
             {#if visible}
                <div in:fly={{ y: 20, duration: 800 }}>
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
                        <Github size={16} /> <span class="text-xs font-bold uppercase">100% Open Source</span>
                    </div>
                    <h1 class="text-5xl md:text-7xl font-extrabold text-[var(--text-primary)] mb-6">
                        Own Your <span class="text-blue-500">Infrastructure</span>.
                    </h1>
                    <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-8">
                        Deploy UFO on your own Cloudflare account in minutes. Zero recurring costs. 
                        Complete privacy control. The ultimate link shortener for developers.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://github.com/yourusername/ufo" target="_blank" class="btn-primary bg-white text-black hover:bg-gray-200 shadow-none border border-transparent">
                            <Github class="inline mr-2" size={20}/> Star on GitHub
                        </a>
                        <a href="/register" class="px-8 py-3 rounded-md font-bold text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]">
                            View Demo
                        </a>
                    </div>
                </div>
            {/if}
        </section>

         <!-- Feature: Self Hosted -->
        <section class="py-24 bg-[var(--bg-secondary)]/30 border-y border-[var(--border-color)]">
            <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                <div class="space-y-6">
                    <div class="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                        <Server class="text-blue-500 w-8 h-8" />
                    </div>
                    <h2 class="text-4xl font-bold text-[var(--text-primary)]">Easy Cloudflare Deployment</h2>
                    <p class="text-[var(--text-secondary)] text-lg leading-relaxed">
                        Designed for Cloudflare Workers & D1. 
                        Deploy globally with a single command. `npm run deploy`. 
                        Scale to millions of requests without managing a single server.
                    </p>
                    <button class="inline-flex items-center text-blue-400 font-bold hover:underline gap-2">Read Docs <ArrowRight size={16}/></button>
                </div>
                 <div class="relative h-64 md:h-96 bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden flex flex-col p-4 font-mono text-xs text-gray-400 shadow-2xl">
                    <div class="flex gap-2 mb-4">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div><div class="w-3 h-3 rounded-full bg-yellow-500"></div><div class="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div class="space-y-2">
                        <p><span class="text-green-500">➜</span> <span class="text-blue-400">~/ufo</span> npm run deploy</p>
                        <p class="text-gray-500 animate-pulse">Building project...</p>
                        <p class="text-gray-500 opacity-0 animate-fade-in" style="animation-delay: 1s; animation-fill-mode: forwards;">Uploading Worker to Cloudflare...</p>
                        <p class="text-green-400 opacity-0 animate-fade-in" style="animation-delay: 2s; animation-fill-mode: forwards;">✔ Success! Deployed to https://ufo.dev</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Feature: MIT License -->
        <section class="py-24 px-4">
            <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                 <div class="order-2 md:order-1 relative h-64 md:h-96 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden flex items-center justify-center">
                    <Code class="w-32 h-32 text-orange-500" />
                </div>
                <div class="order-1 md:order-2 space-y-6">
                    <div class="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                        <Database class="text-orange-500 w-8 h-8" />
                    </div>
                    <h2 class="text-4xl font-bold text-[var(--text-primary)]">MIT Licensed & Privacy First</h2>
                    <p class="text-[var(--text-secondary)] text-lg leading-relaxed">
                        It's your data. Keep it that way. 
                        The MIT license gives you total freedom to fork, modify, and resell. 
                        No telemetry, no tracking pixels, just pure code.
                    </p>
                    <a href="https://github.com/yourusername/ufo/blob/main/LICENSE" target="_blank" class="inline-flex items-center text-orange-400 font-bold hover:underline gap-2">View License <ArrowRight size={16}/></a>
                </div>
            </div>
        </section>
    {/if}

</div>

<style>
    :global(html) {
        scroll-behavior: smooth;
    }
    
    .glitch-effect {
        text-shadow: 2px 2px 0px rgba(57, 255, 20, 0.4), -2px -2px 0px rgba(138, 43, 226, 0.4);
        animation: glitch 3s infinite;
    }
    
    @keyframes glitch {
        0% { transform: translate(0) }
        20% { transform: translate(-2px, 2px) }
        40% { transform: translate(-2px, -2px) }
        60% { transform: translate(2px, 2px) }
        80% { transform: translate(2px, -2px) }
        100% { transform: translate(0) }
    }
    
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .animate-fade-in {
        animation: fade-in 0.5s ease-out;
    }
</style>
