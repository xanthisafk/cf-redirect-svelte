<script>
    import { enhance } from '$app/forms';
    import { fade } from 'svelte/transition';
    import { Users, Link, ShieldBan, Trash2, Power, AlertTriangle, CheckCircle, Search, Activity } from 'lucide-svelte';

    let { data } = $props();
    
    let activeTab = $state('links'); // 'links' | 'users'
    let searchTerm = $state('');

    let filteredLinks = $derived(
        data.links ? data.links.filter(l => (l.slug || '').includes(searchTerm) || (l.original_url || '').includes(searchTerm)) : []
    );
    
    let filteredUsers = $derived(
        data.users ? data.users.filter(u => (u.username || '').includes(searchTerm)) : []
    );
</script>

<div class="space-y-6" in:fade>
    <div class="flex justify-between items-end border-b border-[var(--border-color)] pb-4">
        <div>
            <h1 class="text-3xl font-bold text-red-500 tracking-widest uppercase flex items-center gap-2">
                <ShieldBan class="animate-pulse" /> Command Center
            </h1>
            <p class="text-[var(--text-secondary)]">Restricted Area. Admin Access Only.</p>
        </div>
        
        <div class="flex items-center gap-2 bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-color)]">
             <button 
                onclick={() => activeTab = 'links'}
                class="px-4 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer {activeTab === 'links' ? 'bg-neon-green text-black shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
            >
                <div class="flex items-center gap-2"><Link size={16}/> Links</div>
            </button>
            <button 
                onclick={() => activeTab = 'users'} 
                class="px-4 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer {activeTab === 'users' ? 'bg-neon-green text-black shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
            >
                 <div class="flex items-center gap-2"><Users size={16}/> Users</div>
            </button>
        </div>
    </div>
    
    <!-- Search Bar -->
    <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
        <input 
            type="text" 
            bind:value={searchTerm} 
            placeholder={activeTab === 'links' ? "Search links by slug or url..." : "Search users by username..."} 
            class="input-field w-full pl-10"
        />
    </div>

    <!-- Links Tab -->
    {#if activeTab === 'links'}
        <div class="card overflow-hidden p-0" in:fade>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-[var(--bg-primary)] text-[var(--text-secondary)] uppercase text-xs">
                        <tr>
                            <th class="px-6 py-3">Slug</th>
                            <th class="px-6 py-3">Original URL</th>
                            <th class="px-6 py-3">User</th>
                            <th class="px-6 py-3">Views</th>
                            <th class="px-6 py-3">Status</th>
                            <th class="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[var(--border-color)]">
                        {#each filteredLinks as link (link.id)}
                            <tr class="hover:bg-[var(--bg-primary)]/50 transition-colors">
                                <td class="px-6 py-4 font-mono text-neon-green">{link.slug}</td>
                                <td class="px-6 py-4 text-sm truncate max-w-[200px]" title={link.original_url}>{link.original_url}</td>
                                <td class="px-6 py-4 text-sm">{link.user_id}</td>
                                <td class="px-6 py-4 text-sm">{link.views}</td>
                                <td class="px-6 py-4">
                                    {#if link.is_active}
                                        <span class="inline-flex items-center gap-1 text-green-500 text-xs font-bold px-2 py-1 rounded bg-green-500/10"><CheckCircle size={12}/> ACTIVE</span>
                                    {:else}
                                        <span class="inline-flex items-center gap-1 text-red-500 text-xs font-bold px-2 py-1 rounded bg-red-500/10"><Power size={12}/> DISABLED</span>
                                    {/if}
                                </td>
                                <td class="px-6 py-4 text-right flex justify-end gap-2">
                                     <!-- Ban Link (URL Blacklist) -->
                                     <form action="?/banLink" method="POST" use:enhance class="inline">
                                        <input type="hidden" name="type" value="url" />
                                        <input type="hidden" name="value" value={link.original_url} />
                                        <input type="hidden" name="reason" value="Admin banned via Command" />
                                        <button type="submit" class="p-2 bg-neutral-800 text-yellow-500 rounded hover:bg-neutral-700 cursor-pointer" title="Blacklist URL">
                                            <ShieldBan size={16} />
                                        </button>
                                    </form>
                                    
                                    <!-- Hard Delete -->
                                    <form action="?/delete" method="POST" use:enhance class="inline">
                                        <input type="hidden" name="id" value={link.id} />
                                        <button type="submit" class="p-2 bg-neutral-800 text-red-500 rounded hover:bg-neutral-700 cursor-pointer" title="Permanently Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}

    <!-- Users Tab -->
    {#if activeTab === 'users'}
        <div class="card overflow-hidden p-0" in:fade>
             <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-[var(--bg-primary)] text-[var(--text-secondary)] uppercase text-xs">
                        <tr>
                            <th class="px-6 py-3">Username</th>
                            <th class="px-6 py-3">Role</th>
                            <th class="px-6 py-3">Joined</th>
                            <th class="px-6 py-3">Status</th>
                            <th class="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[var(--border-color)]">
                        {#each filteredUsers as user (user.id)}
                            <tr class="hover:bg-[var(--bg-primary)]/50 transition-colors">
                                <td class="px-6 py-4 font-bold text-[var(--text-primary)]">{user.username}</td>
                                <td class="px-6 py-4 text-sm">
                                    <span class="px-2 py-1 rounded text-xs font-bold {user.role === 'admin' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'}">
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-[var(--text-secondary)]">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td class="px-6 py-4">
                                     {#if user.is_banned}
                                        <span class="inline-flex items-center gap-1 text-red-500 text-xs font-bold px-2 py-1 rounded bg-red-500/10"><AlertTriangle size={12}/> BANNED</span>
                                    {:else}
                                        <span class="inline-flex items-center gap-1 text-green-500 text-xs font-bold px-2 py-1 rounded bg-green-500/10"><Activity size={12}/> ACTIVE</span>
                                    {/if}
                                </td>
                                <td class="px-6 py-4 text-right">
                                    {#if !user.is_banned && user.role !== 'admin'}
                                        <form action="?/banUser" method="POST" use:enhance class="inline">
                                            <input type="hidden" name="id" value={user.id} />
                                            <button type="submit" class="btn-primary bg-red-600 hover:bg-red-700 text-white shadow-none text-xs py-1 px-3" title="Ban User & Disable Links">
                                                BAN USER
                                            </button>
                                        </form>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>
