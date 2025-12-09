<script>
    import { enhance } from '$app/forms';
    
    let { form } = $props();
</script>

<div class="flex justify-center items-center min-h-[calc(100vh-16rem)]">
    <div class="card w-full max-w-md">
        <h2 class="text-3xl font-bold text-center text-neon-green mb-6">Register</h2>
        
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
                    minlength="8"
                />
                <p class="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>
            
            <div>
                <label for="passwordConfirm" class="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                <input 
                    type="password" 
                    id="passwordConfirm" 
                    name="passwordConfirm" 
                    class="input-field w-full"
                    required
                />
            </div>

            {#if form?.exists}
                <div class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded text-sm text-center">
                    Username already exists
                </div>
            {/if}
            {#if form?.match === false}
                <div class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded text-sm text-center">
                    Passwords do not match
                </div>
            {/if}
            {#if form?.short}
                <div class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded text-sm text-center">
                    Password is too short
                </div>
            {/if}

            <button type="submit" class="btn-primary w-full shadow-lg">
                Create Account
            </button>
            
            <div class="text-center text-sm text-gray-400">
                Already have an account? <a href="/login" class="text-neon-green hover:underline">Login</a>
            </div>
        </form>
    </div>
</div>
