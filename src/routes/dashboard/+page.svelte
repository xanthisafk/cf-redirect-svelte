<script>
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { slide, fade, fly, scale } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { QrCode, Trash2, Edit2, Copy, Check, ExternalLink, Eye, Calendar, Plus, X, RotateCcw, BarChart2 } from 'lucide-svelte';
    
    let { data, form } = $props();
    
    let showCreateModal = $state(false);
    let showEditModal = $state(false);
    let showQRModal = $state(false);
    let currentQRUrl = $state('');
    let qrCodeContainer = $state();

    let qrCode;
    
    // UI States
    let copiedId = $state(null);
    
    // Edit State
    let editingLink = $state(null);

    async function openQR(url) {
        currentQRUrl = url;
        showQRModal = true;
    }

    $effect(() => {
        if (showQRModal && qrCodeContainer && currentQRUrl) {
            // Use an IIFE async function to handle the import and generation
            (async () => {
                qrCodeContainer.innerHTML = '';
             
                // Dynamic import to ensure client-side only
                const QRCodeStylingLib = await import('qr-code-styling');
                const QRCodeStyling = QRCodeStylingLib.default || QRCodeStylingLib;

                qrCode = new QRCodeStyling({
                    width: 300,
                    height: 300,
                    type: "svg",
                    data: currentQRUrl,
                    image: window.location.origin + "/favicon.svg",
                    dotsOptions: {
                        color: "#39ff14",
                        type: "rounded"
                    },
                    backgroundOptions: {
                        color: "#0a0a0a",
                    },
                    imageOptions: {
                        crossOrigin: "anonymous",
                        margin: 10
                    }
                });
                qrCode.append(qrCodeContainer);
            })();
        }
    });

    
    function downloadQR() {
        if (qrCode) {
            qrCode.download({ name: "ufo-link", extension: "png" });
        }
    }

    function openEdit(link) {
        editingLink = { ...link }; // Clone
        showEditModal = true;
    }
    
    async function copyToClipboard(text, id) {
        try {
            await navigator.clipboard.writeText(text);
            copiedId = id;
            setTimeout(() => copiedId = null, 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    }
</script>

<div class="space-y-8" in:fade={{ duration: 300 }}>
    <div class="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
        <div>
            <h1 class="text-3xl font-bold text-[var(--text-primary)] tracking-widest uppercase">Dashboard</h1>
            <p class="text-[var(--text-secondary)]">Manage your abducted links.</p>
        </div>
        <button onclick={() => showCreateModal = true} class="btn-primary transform hover:scale-105 transition-transform flex items-center gap-2">
            <Plus size={18} /> New Link
        </button>
    </div>

    <!-- Active Links -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold text-neon-green flex items-center gap-2">
            Active Links
            <span class="text-xs font-normal text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] px-2 py-0.5 rounded-full">{data.links.length}</span>
        </h2>
        
        {#if data.links.length === 0}
            <div class="text-center py-10 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] border-dashed animate-pulse">
                <p class="text-[var(--text-secondary)]">No links found. Abduct your first URL now!</p>
            </div>
        {:else}
            <div class="grid gap-4">
                {#each data.links as link (link.id)}
                    <div animate:flip={{ duration: 300 }} in:fly={{ y: 20, duration: 300 }} out:slide={{ duration: 200 }} class="card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-500 transition-colors group relative overflow-hidden">
                        <!-- Glow effect on hover -->
                        <div class="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        <div class="flex-grow overflow-hidden relative z-10 w-full md:w-auto">
                            <div class="flex items-center gap-2 mb-1">
                                <h3 class="font-bold text-lg truncate text-[var(--text-primary)] max-w-[200px] md:max-w-md" title={link.title}>{link.title || link.slug}</h3>
                                {#if !link.is_active}
                                    <span class="px-2 py-0.5 rounded text-[10px] bg-red-900 text-red-100">DISABLED</span>
                                {/if}
                            </div>
                            <div class="text-[var(--text-secondary)] text-sm truncate max-w-full" title={link.original_url}>{link.original_url}</div>
                            <div class="mt-2 flex items-center gap-2 text-sm flex-wrap">
                                <a href="/{link.slug}" target="_blank" class="text-neon-green hover:underline flex items-center gap-1 font-mono">
                                    /{link.slug} 
                                    <ExternalLink size={12} />
                                </a>
                                
                                <button onclick={() => copyToClipboard(window.location.origin + '/' + link.slug, link.id)} class="text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer" title="Copy Link">
                                    {#if copiedId === link.id}
                                        <Check size={14} class="text-green-500" />
                                    {:else}
                                        <Copy size={14} />
                                    {/if}
                                </button>

                                <span class="text-[var(--border-color)]">|</span>
                                <span class="text-[var(--text-secondary)] text-xs flex items-center gap-1"><Eye size={12} /> {link.views} views</span>
                                <span class="text-[var(--border-color)]">|</span>
                                <span class="text-[var(--text-secondary)] text-xs flex items-center gap-1"><Calendar size={12} /> {new Date(link.created_at).toLocaleDateString()}</span>
                                {#if link.expires_at}
                                    <span class="text-[var(--border-color)]">|</span>
                                    <span class="text-orange-400 text-xs">Exp: {new Date(link.expires_at).toLocaleDateString()}</span>
                                {/if}
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-1 self-end md:self-center relative z-10">
                            <button onclick={() => openQR(window.location.origin + '/' + link.slug)} class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10 rounded transition-colors cursor-pointer" title="QR Code">
                                <QrCode size={18} />
                            </button>
                            <a href="/details/{link.slug}" class="p-2 text-[var(--text-secondary)] hover:text-purple-400 hover:bg-purple-400/10 rounded transition-colors cursor-pointer flex items-center" title="Analytics">
                                <BarChart2 size={18} />
                            </a>
                            <button onclick={() => openEdit(link)} class="p-2 text-[var(--text-secondary)] hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors cursor-pointer" title="Edit Link">
                                <Edit2 size={18} />
                            </button>
                            <form action="?/delete" method="POST" use:enhance>
                                <input type="hidden" name="id" value={link.id} />
                                <button type="submit" class="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer" title="Move to Recycle Bin">
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Recycle Bin -->
    {#if data.deletedLinks.length > 0}
        <div class="pt-8 border-t border-[var(--border-color)]" in:fade>
            <h2 class="text-xl font-bold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                <Trash2 size={20} /> Recycle Bin <span class="text-xs font-normal text-gray-500">(Auto-deleted after 30 days)</span>
            </h2>
            <div class="space-y-4 opacity-75">
                {#each data.deletedLinks as link (link.id)}
                    <div animate:flip={{ duration: 300 }} in:slide class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4 flex justify-between items-center group hover:opacity-100 transition-opacity">
                        <div class="overflow-hidden">
                            <div class="font-medium text-[var(--text-secondary)] strike-through line-through">{link.slug}</div>
                            <div class="text-xs text-[var(--text-secondary)] truncate">{link.original_url}</div>
                        </div>
                        <form action="?/restore" method="POST" use:enhance>
                            <input type="hidden" name="id" value={link.id} />
                            <button type="submit" class="text-neon-green text-sm hover:underline flex items-center gap-1 cursor-pointer">
                                <span>Restore</span> <RotateCcw size={14} />
                            </button>
                        </form>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<!-- Create Modal -->
{#if showCreateModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" transition:fade={{ duration: 200 }}>
        <div class="card w-full max-w-lg relative" transition:fly={{ y: 20, duration: 300 }}>
            <button onclick={() => showCreateModal = false} class="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"><X size={20} /></button>
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-6">Create New Link</h2>
            
            <form action="?/create" method="POST" use:enhance={() => {
                return async ({ result, update }) => {
                    if (result.type === 'success') {
                        showCreateModal = false;
                        await update(); 
                    }
                };
            }} class="space-y-4">
                <div>
                    <label for="url" class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Destination URL</label>
                    <input type="url" name="url" id="url" required class="input-field w-full" placeholder="https://example.com" />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="slug" class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Custom Slug</label>
                        <div class="flex">
                             <div class="bg-[var(--bg-primary)] border border-r-0 border-[var(--border-color)] text-[var(--text-secondary)] px-3 py-2 rounded-l flex items-center text-sm select-none">
                                {$page.url.host}/
                             </div>
                             <input type="text" name="slug" id="slug" class="input-field w-full rounded-l-none" placeholder="random" pattern="[a-zA-Z0-9_\-]+" />
                        </div>
                    </div>
                     <div>
                        <label for="expires_at" class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Expires (Optional)</label>
                        <input type="datetime-local" name="expires_at" id="expires_at" class="input-field w-full" />
                    </div>
                </div>
                
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-300 mb-1">Title (Optional)</label>
                    <input type="text" name="title" id="title" class="input-field w-full" placeholder="Internal Name" />
                </div>

                <div class="pt-4 flex justify-end gap-3">
                    <button type="button" onclick={() => showCreateModal = false} class="px-4 py-2 rounded text-gray-300 hover:bg-gray-800 transition-colors">Cancel</button>
                    <button type="submit" class="btn-primary w-full sm:w-auto">Abduct Link 👽</button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Edit Modal -->
{#if showEditModal && editingLink}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" transition:fade={{ duration: 200 }}>
        <div class="card w-full max-w-lg relative" transition:fly={{ y: 20, duration: 300 }}>
            <button onclick={() => showEditModal = false} class="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
            <h2 class="text-2xl font-bold text-white mb-6">Edit Link</h2>
            
            <form action="?/edit" method="POST" use:enhance={() => {
                return async ({ result, update }) => {
                    if (result.type === 'success') {
                        showEditModal = false;
                        await update();
                    }
                };
            }} class="space-y-4">
                <input type="hidden" name="id" value={editingLink.id} />
                
                <div>
                    <label for="edit_url" class="block text-sm font-medium text-gray-300 mb-1">Destination URL</label>
                    <input type="url" name="url" id="edit_url" value={editingLink.original_url} required class="input-field w-full" />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="edit_slug" class="block text-sm font-medium text-gray-300 mb-1">Slug</label>
                        <input type="text" name="slug" id="edit_slug" value={editingLink.slug} required class="input-field w-full" pattern="[a-zA-Z0-9_\-]+" />
                    </div>
                     <div>
                        <label for="edit_expires_at" class="block text-sm font-medium text-gray-300 mb-1">Expires</label>
                        <!-- Formatting datetime-local value is tricky, keeping simple for demo or using helper if needed -->
                        <input type="datetime-local" name="expires_at" id="edit_expires_at" value={editingLink.expires_at ? editingLink.expires_at.slice(0, 16) : ''} class="input-field w-full text-white bg-gray-800" />
                    </div>
                </div>
                
                <div>
                    <label for="edit_title" class="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input type="text" name="title" id="edit_title" value={editingLink.title ?? ''} class="input-field w-full" />
                </div>

                <div class="pt-4 flex justify-end gap-3">
                    <button type="button" onclick={() => showEditModal = false} class="px-4 py-2 rounded text-gray-300 hover:bg-gray-800 transition-colors">Cancel</button>
                    <button type="submit" class="btn-primary w-full sm:w-auto">Update Link</button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- QR Code Modal -->
{#if showQRModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" transition:fade>
        <div class="card w-full max-w-sm relative flex flex-col items-center bg-[var(--bg-secondary)]" transition:scale={{ duration: 300, start: 0.9 }}>
             <button type="button" onclick={() => showQRModal = false} class="absolute top-2 right-2 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-white/10 z-50 cursor-pointer">
                <X size={24} />
             </button>
             <h2 class="text-xl font-bold text-[var(--text-primary)] mb-6 mt-2">QR Code</h2>
             
             <div bind:this={qrCodeContainer} class="bg-white p-2 rounded mb-6 min-h-[300px] min-w-[300px]"></div>
             
             <button onclick={downloadQR} class="btn-primary w-full">Download PNG</button>
        </div>
    </div>
{/if}
