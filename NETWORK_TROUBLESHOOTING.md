# Network Troubleshooting Guide

## GNews API Connection Issues

If you're experiencing timeout errors when trying to fetch news from the GNews API, this guide will help you resolve the issue.

### Symptoms

```
TypeError: fetch failed
ConnectTimeoutError: Connect Timeout Error
```

### Common Causes

1. **Firewall/Antivirus blocking the connection**
   - Windows Firewall
   - Corporate firewall
   - Antivirus software (Norton, McAfee, Kaspersky, etc.)

2. **VPN or Proxy configuration**
   - VPN blocking the connection
   - Corporate proxy settings

3. **Network restrictions**
   - ISP blocking certain domains
   - Geographic restrictions

4. **DNS issues**
   - DNS resolution failing for gnews.io

### Solutions

#### Option 1: Use Mock Data (Recommended for Development)

Add this line to your `.env.local` file:

```env
USE_MOCK_NEWS_DATA=true
```

This will use realistic mock news data instead of calling the external API. Perfect for:
- Development and testing
- When you have network restrictions
- Offline development

#### Option 2: Fix Network Connectivity

1. **Disable Firewall Temporarily (Windows)**
   ```powershell
   # Run as Administrator
   netsh advfirewall set allprofiles state off
   ```
   ⚠️ Remember to turn it back on after testing!

2. **Check VPN Settings**
   - Try disconnecting from VPN
   - Or configure VPN to allow gnews.io

3. **Configure Proxy (if in corporate network)**
   Add to `.env.local`:
   ```env
   HTTP_PROXY=http://proxy.company.com:8080
   HTTPS_PROXY=http://proxy.company.com:8080
   ```

4. **Test Connectivity**
   ```bash
   # Test if you can reach GNews API
   curl https://gnews.io/api/v4/search?q=test&lang=en&max=1&apikey=YOUR_API_KEY
   ```

5. **Try Different DNS**
   - Switch to Google DNS (8.8.8.8, 8.8.4.4)
   - Or Cloudflare DNS (1.1.1.1, 1.0.0.1)

#### Option 3: Alternative News API

If GNews continues to have issues, consider switching to an alternative:

- [NewsAPI.org](https://newsapi.org/) - Free tier available
- [Currents API](https://currentsapi.services/) - Free tier available
- [News Data IO](https://newsdata.io/) - Free tier available

### Environment Variables

Your `.env.local` should look like:

```env
# Option 1: Use real API (requires network access to gnews.io)
GNEWS_API_KEY=your_actual_api_key_here
USE_MOCK_NEWS_DATA=false

# Option 2: Use mock data (no network required)
GNEWS_API_KEY=your_actual_api_key_here
USE_MOCK_NEWS_DATA=true

# For JSONPlaceholder demo (optional)
NEXT_PUBLIC_API_BASE_URL=https://jsonplaceholder.typicode.com
```

### Verifying the Fix

1. **Restart your dev server** after changing `.env.local`:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Check the console** - you should see one of:
   - ✅ `Using mock news data (USE_MOCK_NEWS_DATA=true)` - Mock data is active
   - ✅ `Using mock news data due to API connectivity issues` - Automatic fallback
   - ✅ No warnings - Real API is working

3. **Reload the browser** and check if news articles appear

### Need More Help?

Check these logs in your terminal:
- `News API error:` - Shows what went wrong
- `Request timeout after 15 seconds` - Network timeout
- `Fetch error:` - Network connectivity issue

The app now automatically falls back to mock data when it can't reach the GNews API, so you can continue developing even with network issues.

