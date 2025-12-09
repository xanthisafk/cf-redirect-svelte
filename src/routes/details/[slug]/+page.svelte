<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import { ArrowLeft, Globe, Layout, Monitor, Smartphone, Cpu } from 'lucide-svelte';
    
    let { data } = $props();
    const { link, stats } = data;

    let browserChartCanvas;
    let osChartCanvas;
    let deviceChartCanvas;
    
    function initChart(canvas, type, title, dataItems) {
        if (!canvas) return;
        
        const labels = dataItems.map(d => d.name || 'Unknown');
        const counts = dataItems.map(d => d.count);
        
        // Neon palette
        const colors = [
            '#39ff14', // Neon Green
            '#bc13fe', // Neon Purple
            '#04d9ff', // Neon Blue
            '#ff073a', // Neon Red
            '#fefe33', // Neon Yellow
            '#ffffff'  // White
        ];

        new Chart(canvas, {
            type: type, // 'doughnut' or 'bar'
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: counts,
                    backgroundColor: colors,
                    borderColor: '#0a0a0a',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#9ca3af' }
                    }
                }
            }
        });
    }

    onMount(() => {
        initChart(browserChartCanvas, 'doughnut', 'Browsers', stats.browsers);
        initChart(osChartCanvas, 'doughnut', 'OS', stats.os);
        initChart(deviceChartCanvas, 'pie', 'Devices', stats.devices);
    });
</script>

<div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
            <a href="/dashboard" class="text-xs font-mono text-neon-green hover:underline flex items-center gap-1 mb-2">
                <ArrowLeft size={12} /> Back to Dashboard
            </a>
            <h1 class="text-3xl font-bold text-[var(--text-primary)] tracking-widest uppercase">Analytics</h1>
            <p class="text-[var(--text-secondary)] font-mono">/{link.slug} <span class="mx-2">→</span> {link.original_url}</p>
        </div>
        <div class="text-right">
            <div class="text-4xl font-bold text-neon-green">{link.views}</div>
            <div class="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Total Visits</div>
        </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Browser -->
        <div class="card bg-[var(--bg-secondary)] p-4">
            <h3 class="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Globe size={18}/> Browsers</h3>
            <div class="relative h-64">
                <canvas bind:this={browserChartCanvas}></canvas>
            </div>
        </div>

        <!-- OS -->
        <div class="card bg-[var(--bg-secondary)] p-4">
            <h3 class="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Cpu size={18}/> OS</h3>
            <div class="relative h-64">
                <canvas bind:this={osChartCanvas}></canvas>
            </div>
        </div>

        <!-- Device -->
        <div class="card bg-[var(--bg-secondary)] p-4">
            <h3 class="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Smartphone size={18}/> Devices</h3>
             <div class="relative h-64">
                <canvas bind:this={deviceChartCanvas}></canvas>
            </div>
        </div>
    </div>

    <!-- Locations & Recent Visits Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Locations List -->
        <div class="card bg-[var(--bg-secondary)]">
            <div class="p-6 border-b border-[var(--border-color)]">
                <h3 class="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2"><Layout size={20}/> Top Locations</h3>
            </div>
            <div class="max-h-96 overflow-y-auto">
                <table class="w-full text-left text-sm text-[var(--text-secondary)]">
                    <thead class="bg-black/20 text-[var(--text-primary)] font-bold uppercase text-xs">
                        <tr>
                            <th class="p-4">Country</th>
                            <th class="p-4 text-right">Visits</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[var(--border-color)]">
                         {#each stats.countries as country}
                            <tr class="hover:bg-white/5 transition-colors">
                                <td class="p-4">{country.name || 'Unknown'}</td>
                                <td class="p-4 text-right font-mono text-neon-green">{country.count}</td>
                            </tr>
                        {:else}
                             <tr><td colspan="2" class="p-4 text-center">No location data yet</td></tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Recent Log -->
        <div class="card bg-[var(--bg-secondary)]">
             <div class="p-6 border-b border-[var(--border-color)]">
                <h3 class="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2"><Monitor size={20}/> Recent Activity</h3>
            </div>
            <div class="max-h-96 overflow-y-auto">
                 <table class="w-full text-left text-sm text-[var(--text-secondary)]">
                    <thead class="bg-black/20 text-[var(--text-primary)] font-bold uppercase text-xs">
                        <tr>
                            <th class="p-4">Time</th>
                            <th class="p-4">Details</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[var(--border-color)]">
                        {#each stats.recent as visit}
                            <tr class="hover:bg-white/5 transition-colors">
                                <td class="p-4 whitespace-nowrap">{new Date(visit.created_at).toLocaleString()}</td>
                                <td class="p-4">
                                    <div class="text-[var(--text-primary)]">{visit.country || '?'} - {visit.city || '?'}</div>
                                    <div class="text-xs opacity-70">{visit.os || 'OS?'} / {visit.browser || 'Browser?'}</div>
                                    {#if visit.referrer && visit.referrer !== 'Direct'}
                                        <div class="text-xs text-blue-400 truncate max-w-[200px]" title={visit.referrer}>Ref: {visit.referrer}</div>
                                    {/if}
                                </td>
                            </tr>
                        {:else}
                             <tr><td colspan="2" class="p-4 text-center">No visits recorded</td></tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
