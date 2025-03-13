/// app\oauth\GoogleOAuth.jsx

export default function GoogleOAuth({ nonce }) {

    const handleGoogleLogin = () => {
        if (!nonce) {
            console.error("No nonce provided for Google OAuth login");
            return;
        }

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
        const redirectUriValue = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI;
        if (!clientId || !redirectUriValue) {
            console.error("Google OAuth client ID or redirect URI not found in environment variables");
            return;
        }

        const redirectUri = encodeURIComponent(redirectUriValue);
        const scope = encodeURIComponent("openid email profile");
        const responseType = "id_token";

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&nonce=${nonce}`;

        const popupWidth = 500;
        const popupHeight = 700;
        const left = window.screen.width / 2 - popupWidth / 2;
        const top = window.screen.height / 2 - popupHeight / 2;

        window.open(
            authUrl,
            "_blank",
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
        );
    };

    return (
        <div>
            <button
                onClick={handleGoogleLogin}
                className="flex items-center px-4 py-2 border rounded-full shadow-sm hover:bg-gray-100 transition duration-200 bg-white"
            >
                <img src="/ui/google-icon.webp" alt="Google Logo" className="w-6 h-6 mr-2" />
                <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>
        </div>
    )
}