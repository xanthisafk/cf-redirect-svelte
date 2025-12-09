<script>
    import { enhance } from '$app/forms';
    
    let { form } = $props();
</script>

<div class="flex justify-center items-center min-h-[calc(100vh-16rem)]">
    <div class="card w-full max-w-md">
        <h2 class="text-3xl font-bold text-center text-neon-green mb-6">Login</h2>
        
        <form method="POST" use:enhance class="space-y-6">
            <div>
                <label for="username" class="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    class="input-field w-full"
                    value={form?.username ?? ''}
                    required
                />
            </div>
            
            <div>
                <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    class="input-field w-full"
                    required
                />
            </div>

            {#if form?.incorrect}
                <div class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded text-sm text-center">
                    Invalid username or password
                </div>
            {/if}
            {#if form?.missing}
                <div class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded text-sm text-center">
                    Please fill in all fields
                </div>
            {/if}
            {#if form?.message}
                <div class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded text-sm text-center">
                    {form.message}
                </div>
            {/if}

            <button type="submit" class="btn-primary w-full shadow-lg">
                Login
            </button>
            
            <div class="text-center text-sm text-gray-400">
                Don't have an account? <a href="/register" class="text-neon-green hover:underline">Register</a>
            </div>
        </form>
    </div>
</div>
