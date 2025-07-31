# Feedback Widget SDK

A powerful, embeddable feedback widget that allows you to collect user feedback directly on your website.

## Features

- 🎨 **Customizable Design** - Match your brand colors and positioning
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔐 **Account Isolation** - Each account has separate feedback data
- ⚡ **Real-time Updates** - Comments and upvotes sync instantly
- 🛠 **Easy Integration** - Simple JavaScript SDK

## Quick Start

### 1. Get Your API Key

1. Sign up for an account at your feedback dashboard
2. Navigate to the admin panel
3. Click the "API Key" button in the header
4. Copy your unique API key

### 2. Add the Widget to Your Site

Add this code to your website before the closing `</body>` tag:

```html
<!-- Feedback Widget -->
<script src="https://your-domain.com/sdk/feedback-sdk.js"></script>
<script>
  new FeedbackSDK({
    apiKey: 'your-api-key-here',
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    title: 'Feedback'
  });
</script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | **required** | Your unique API key |
| `position` | string | `'bottom-right'` | Widget position: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'` |
| `theme` | string | `'light'` | Theme: `'light'` or `'dark'` |
| `primaryColor` | string | `'#3B82F6'` | Primary color (hex code) |
| `title` | string | `'Feedback'` | Widget title |
| `placeholder` | string | `'Share your feedback...'` | Input placeholder text |

## Advanced Usage

### Programmatic Control

```javascript
// Initialize the widget
const widget = new FeedbackSDK({
  apiKey: 'your-api-key',
  position: 'bottom-right'
});

// Open the widget programmatically
widget.open();

// Close the widget
widget.close();

// Update configuration
widget.updateConfig({
  primaryColor: '#FF6B6B',
  title: 'Help Us Improve'
});

// Remove the widget
widget.destroy();
```

### Custom Styling

The widget automatically inherits your site's font family and respects system preferences. You can customize colors and positioning through the configuration options.

### Mobile Optimization

The widget automatically adapts to mobile screens:
- On desktop: 400px wide sidebar
- On mobile: Full-screen overlay

## API Reference

### Constructor

```javascript
new FeedbackSDK(config)
```

Creates a new feedback widget instance.

### Methods

#### `open()`
Opens the feedback widget.

#### `close()`
Closes the feedback widget.

#### `destroy()`
Removes the widget from the page.

#### `updateConfig(newConfig)`
Updates the widget configuration and recreates it.

## Account Management

Each API key is tied to a specific account:
- **Isolated Data**: Feedback is separated by account
- **Admin Dashboard**: Manage feedback through your admin panel
- **Real-time Sync**: Changes sync between widget and dashboard

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security

- API keys are validated on each request
- All data is stored securely
- No sensitive information is exposed in the client

## Support

For support and questions:
1. Check your admin dashboard
2. Verify your API key is correct
3. Ensure the SDK script is loaded properly

## Examples

### Basic Implementation
```html
<script src="https://your-domain.com/sdk/feedback-sdk.js"></script>
<script>
  new FeedbackSDK({
    apiKey: 'fdk_abc123xyz789'
  });
</script>
```

### Custom Styling
```html
<script>
  new FeedbackSDK({
    apiKey: 'fdk_abc123xyz789',
    position: 'bottom-left',
    primaryColor: '#10B981',
    title: 'Share Your Thoughts',
    theme: 'dark'
  });
</script>
```

### Multiple Widgets
```html
<script>
  // Main feedback widget
  new FeedbackSDK({
    apiKey: 'fdk_main_key',
    position: 'bottom-right',
    title: 'General Feedback'
  });

  // Feature-specific widget
  new FeedbackSDK({
    apiKey: 'fdk_feature_key',
    position: 'bottom-left',
    title: 'Feature Requests',
    primaryColor: '#8B5CF6'
  });
</script>
```