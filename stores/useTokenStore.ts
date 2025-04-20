import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenState {
  accessToken: string | null;
  expiresAt: number | null; // timestamp when token expires
  isLoading: boolean;
  error: string | null;
  setToken: (accessToken: string, expiresIn: number) => void;
  clearToken: () => void;
  initializeToken: () => Promise<void>; // Call this when app loads
  getValidAccessToken: () => Promise<string>;
  generateNewToken: () => Promise<string>;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      expiresAt: null,
      isLoading: false,
      error: null,

      setToken: (accessToken, expiresIn) => {
        const expiresAt = Date.now() + expiresIn * 1000;
        set({ accessToken, expiresAt, error: null });
      },

      clearToken: () => {
        set({ accessToken: null, expiresAt: null, error: null });
      },

      initializeToken: async () => {
        const { accessToken, expiresAt } = get();

        // If no token exists or token is expired, generate a new one
        if (!accessToken || (expiresAt && Date.now() >= expiresAt)) {
          await get().generateNewToken();
        }
      },

      getValidAccessToken: async () => {
        const { accessToken, expiresAt, generateNewToken } = get();

        // If token exists and is still valid (with 30-second buffer)
        if (accessToken && expiresAt && Date.now() < expiresAt - 30000) {
          return accessToken;
        }

        // Token is expired or doesn't exist - generate new one
        return await generateNewToken();
      },

      generateNewToken: async () => {
        const { isLoading } = get();

        if (isLoading) {
          // If we're already generating a token, wait for it
          return new Promise<string>((resolve) => {
            const interval = setInterval(() => {
              const { accessToken, isLoading } = get();
              if (!isLoading && accessToken) {
                clearInterval(interval);
                resolve(accessToken);
              }
            }, 100);
          });
        }

        set({ isLoading: true, error: null });

        try {
          // Call your token generation API
          const response = await fetch("/api/auth/generatetoken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer sdfsdfsdfsdfsdf0809sd8f0sd8f0s8df08sdfjskldvj0()*FS(DFUS(D(SDFYUS(DS(DFSD)))))",
            },
            // Include any required body for your token generation
          });

          if (!response.ok) {
            throw new Error("Failed to generate token");
          }

          const data = await response.json();

        ;

          // Update token in store
          get().setToken(data.token, data.expiresIn);
          return data.token;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
          });
          // Clear token if generation failed
          get().clearToken();
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "token-storage", // name for localStorage
      partialize: (state) => ({
        accessToken: state.accessToken,
        expiresAt: state.expiresAt,
      }),
    }
  )
);
