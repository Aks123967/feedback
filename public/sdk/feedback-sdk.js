/*!
 * Feedback Widget SDK v1.0.0
 * Embeddable feedback widget for websites
 */
(function() {
  'use strict';

  function FeedbackSDK(config) {
    this.config = Object.assign({
      position: 'bottom-right',
      theme: 'light',
      primaryColor: '#3B82F6',
      title: 'Feedback',
      placeholder: 'Share your feedback...'
    }, config);
    
    this.widget = null;
    this.isOpen = false;
    
    this.init();
  }

  FeedbackSDK.prototype.init = function() {
    var self = this;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        self.createWidget();
      });
    } else {
      this.createWidget();
    }
  };

  FeedbackSDK.prototype.createWidget = function() {
    this.widget = document.createElement('div');
    this.widget.id = 'feedback-widget';
    this.widget.innerHTML = this.getWidgetHTML();
    
    this.addStyles();
    document.body.appendChild(this.widget);
    this.addEventListeners();
  };

  FeedbackSDK.prototype.getWidgetHTML = function() {
    var position = this.getPositionStyles();
    
    return [
      '<div class="feedback-trigger" style="' + position + '">',
        '<button class="feedback-btn" id="feedback-trigger-btn">',
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
            '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
          '</svg>',
        '</button>',
      '</div>',
      
      '<div class="feedback-panel" id="feedback-panel" style="display: none;">',
        '<div class="feedback-header">',
          '<h3>' + this.config.title + '</h3>',
          '<button class="feedback-close" id="feedback-close-btn">',
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
              '<line x1="18" y1="6" x2="6" y2="18"></line>',
              '<line x1="6" y1="6" x2="18" y2="18"></line>',
            '</svg>',
          '</button>',
        '</div>',
        '<div class="feedback-content" id="feedback-content">',
          '<div class="feedback-loading">Loading...</div>',
        '</div>',
      '</div>',
      
      '<div class="feedback-overlay" id="feedback-overlay" style="display: none;"></div>'
    ].join('');
  };

  FeedbackSDK.prototype.getPositionStyles = function() {
    var positions = {
      'bottom-right': 'position: fixed; bottom: 20px; right: 20px; z-index: 10000;',
      'bottom-left': 'position: fixed; bottom: 20px; left: 20px; z-index: 10000;',
      'top-right': 'position: fixed; top: 20px; right: 20px; z-index: 10000;',
      'top-left': 'position: fixed; top: 20px; left: 20px; z-index: 10000;'
    };
    return positions[this.config.position] || positions['bottom-right'];
  };

  FeedbackSDK.prototype.addStyles = function() {
    var style = document.createElement('style');
    style.textContent = [
      '.feedback-trigger {',
        'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      '}',
      
      '.feedback-btn {',
        'width: 60px;',
        'height: 60px;',
        'border-radius: 50%;',
        'background: ' + this.config.primaryColor + ';',
        'border: none;',
        'color: white;',
        'cursor: pointer;',
        'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);',
        'transition: all 0.3s ease;',
        'display: flex;',
        'align-items: center;',
        'justify-content: center;',
      '}',
      
      '.feedback-btn:hover {',
        'transform: scale(1.1);',
        'box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);',
      '}',
      
      '.feedback-panel {',
        'position: fixed;',
        'top: 0;',
        'right: 0;',
        'width: 400px;',
        'height: 100vh;',
        'background: white;',
        'box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);',
        'z-index: 10001;',
        'transform: translateX(100%);',
        'transition: transform 0.3s ease;',
        'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      '}',
      
      '.feedback-panel.open {',
        'transform: translateX(0);',
      '}',
      
      '.feedback-header {',
        'display: flex;',
        'justify-content: space-between;',
        'align-items: center;',
        'padding: 20px;',
        'border-bottom: 1px solid #e5e7eb;',
        'background: ' + this.config.primaryColor + ';',
        'color: white;',
      '}',
      
      '.feedback-header h3 {',
        'margin: 0;',
        'font-size: 18px;',
        'font-weight: 600;',
      '}',
      
      '.feedback-close {',
        'background: none;',
        'border: none;',
        'color: white;',
        'cursor: pointer;',
        'padding: 4px;',
        'border-radius: 4px;',
        'transition: background 0.2s;',
      '}',
      
      '.feedback-close:hover {',
        'background: rgba(255, 255, 255, 0.1);',
      '}',
      
      '.feedback-content {',
        'height: calc(100vh - 80px);',
        'overflow-y: auto;',
      '}',
      
      '.feedback-loading {',
        'display: flex;',
        'justify-content: center;',
        'align-items: center;',
        'height: 200px;',
        'color: #6b7280;',
      '}',
      
      '.feedback-overlay {',
        'position: fixed;',
        'top: 0;',
        'left: 0;',
        'width: 100vw;',
        'height: 100vh;',
        'background: rgba(0, 0, 0, 0.3);',
        'z-index: 10000;',
        'opacity: 0;',
        'transition: opacity 0.3s ease;',
      '}',
      
      '.feedback-overlay.visible {',
        'opacity: 1;',
      '}',
      
      '.feedback-widget-content {',
        'padding: 16px;',
        'height: 100%;',
        'display: flex;',
        'flex-direction: column;',
      '}',
      
      '.feedback-search-bar {',
        'display: flex;',
        'gap: 8px;',
        'margin-bottom: 16px;',
      '}',
      
      '.feedback-search-input {',
        'flex: 1;',
        'padding: 8px 12px;',
        'border: 1px solid #e5e7eb;',
        'border-radius: 6px;',
        'font-size: 14px;',
      '}',
      
      '.feedback-add-button {',
        'width: 36px;',
        'height: 36px;',
        'background: ' + this.config.primaryColor + ';',
        'color: white;',
        'border: none;',
        'border-radius: 6px;',
        'cursor: pointer;',
        'font-size: 18px;',
        'font-weight: bold;',
      '}',
      
      '.feedback-list {',
        'flex: 1;',
        'overflow-y: auto;',
      '}',
      
      '.feedback-item {',
        'display: flex;',
        'gap: 12px;',
        'padding: 12px;',
        'border: 1px solid #e5e7eb;',
        'border-radius: 8px;',
        'margin-bottom: 8px;',
        'cursor: pointer;',
        'transition: box-shadow 0.2s;',
      '}',
      
      '.feedback-item:hover {',
        'box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
      '}',
      
      '.feedback-vote {',
        'display: flex;',
        'flex-direction: column;',
        'align-items: center;',
        'gap: 4px;',
      '}',
      
      '.feedback-upvote-btn {',
        'background: none;',
        'border: 1px solid #e5e7eb;',
        'border-radius: 4px;',
        'padding: 4px 8px;',
        'cursor: pointer;',
        'font-size: 12px;',
      '}',
      
      '.feedback-upvote-btn:hover {',
        'background: #f3f4f6;',
      '}',
      
      '.feedback-vote-count {',
        'font-weight: bold;',
        'font-size: 14px;',
      '}',
      
      '.feedback-content {',
        'flex: 1;',
      '}',
      
      '.feedback-title {',
        'margin: 0 0 4px 0;',
        'font-size: 14px;',
        'font-weight: 600;',
        'color: #111827;',
      '}',
      
      '.feedback-description {',
        'margin: 0 0 8px 0;',
        'font-size: 12px;',
        'color: #6b7280;',
        'line-height: 1.4;',
      '}',
      
      '.feedback-meta {',
        'font-size: 11px;',
        'color: #9ca3af;',
      '}',
      
      '.feedback-form {',
        'padding: 16px;',
      '}',
      
      '.feedback-form-header {',
        'display: flex;',
        'align-items: center;',
        'gap: 12px;',
        'margin-bottom: 16px;',
      '}',
      
      '.feedback-back-button {',
        'background: none;',
        'border: none;',
        'cursor: pointer;',
        'font-size: 14px;',
        'color: #6b7280;',
      '}',
      
      '.feedback-form h3 {',
        'margin: 0;',
        'font-size: 16px;',
        'font-weight: 600;',
      '}',
      
      '.feedback-input, .feedback-textarea {',
        'width: 100%;',
        'padding: 8px 12px;',
        'border: 1px solid #e5e7eb;',
        'border-radius: 6px;',
        'font-size: 14px;',
        'margin-bottom: 12px;',
        'font-family: inherit;',
        'box-sizing: border-box;',
      '}',
      
      '.feedback-textarea {',
        'resize: vertical;',
        'min-height: 80px;',
      '}',
      
      '.feedback-form-actions {',
        'display: flex;',
        'gap: 8px;',
        'justify-content: flex-end;',
      '}',
      
      '.feedback-cancel-button {',
        'padding: 8px 16px;',
        'border: 1px solid #e5e7eb;',
        'background: white;',
        'border-radius: 6px;',
        'cursor: pointer;',
        'font-size: 14px;',
      '}',
      
      '.feedback-submit-button {',
        'padding: 8px 16px;',
        'background: ' + this.config.primaryColor + ';',
        'color: white;',
        'border: none;',
        'border-radius: 6px;',
        'cursor: pointer;',
        'font-size: 14px;',
      '}',
      
      '.feedback-empty {',
        'text-align: center;',
        'padding: 40px 20px;',
        'color: #6b7280;',
      '}',
      
      '@media (max-width: 480px) {',
        '.feedback-panel {',
          'width: 100vw;',
        '}',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  };

  FeedbackSDK.prototype.addEventListeners = function() {
    var self = this;
    var triggerBtn = document.getElementById('feedback-trigger-btn');
    var closeBtn = document.getElementById('feedback-close-btn');
    var overlay = document.getElementById('feedback-overlay');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', function() {
        self.openWidget();
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        self.closeWidget();
      });
    }
    
    if (overlay) {
      overlay.addEventListener('click', function() {
        self.closeWidget();
      });
    }
  };

  FeedbackSDK.prototype.openWidget = function() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    var panel = document.getElementById('feedback-panel');
    var overlay = document.getElementById('feedback-overlay');
    
    if (panel && overlay) {
      panel.style.display = 'block';
      overlay.style.display = 'block';
      
      var self = this;
      setTimeout(function() {
        panel.classList.add('open');
        overlay.classList.add('visible');
      }, 10);
      
      this.loadFeedbackContent();
    }
  };

  FeedbackSDK.prototype.closeWidget = function() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    var panel = document.getElementById('feedback-panel');
    var overlay = document.getElementById('feedback-overlay');
    
    if (panel && overlay) {
      panel.classList.remove('open');
      overlay.classList.remove('visible');
      
      setTimeout(function() {
        panel.style.display = 'none';
        overlay.style.display = 'none';
      }, 300);
    }
  };

  FeedbackSDK.prototype.loadFeedbackContent = function() {
    var content = document.getElementById('feedback-content');
    if (!content) return;
    
    try {
      // Load content directly without iframe to avoid CORS issues
      content.innerHTML = this.getFeedbackContentHTML();
      this.addFeedbackEventListeners();
      
    } catch (error) {
      content.innerHTML = [
        '<div style="padding: 20px; text-align: center; color: #ef4444;">',
          '<p>Failed to load feedback widget</p>',
          '<p style="font-size: 14px; color: #6b7280;">Please check your API key</p>',
        '</div>'
      ].join('');
    }
  };

  FeedbackSDK.prototype.getFeedbackContentHTML = function() {
    return [
      '<div class="feedback-widget-content">',
        '<div class="feedback-search-bar">',
          '<input type="text" class="feedback-search-input" placeholder="Search ideas..." id="feedback-search">',
          '<button class="feedback-add-button" id="feedback-add-btn">+</button>',
        '</div>',
        '<div class="feedback-list" id="feedback-list">',
          this.getFeedbackListHTML(),
        '</div>',
      '</div>',
      '<div class="feedback-form" id="feedback-form" style="display: none;">',
        '<div class="feedback-form-header">',
          '<button class="feedback-back-button" id="feedback-back-btn">← Back</button>',
          '<h3>Share Idea</h3>',
        '</div>',
        '<input type="text" class="feedback-input" placeholder="Title" id="feedback-title">',
        '<textarea class="feedback-textarea" placeholder="Describe your idea" id="feedback-description"></textarea>',
        '<select class="feedback-input" id="feedback-category">',
          '<option value="">Select Category (Optional)</option>',
          '<option value="feature">Feature</option>',
          '<option value="improvement">Improvement</option>',
          '<option value="bug">Bug Fix</option>',
          '<option value="announcement">Announcement</option>',
        '</select>',
        '<div class="feedback-form-actions">',
          '<button class="feedback-cancel-button" id="feedback-cancel-btn">Cancel</button>',
          '<button class="feedback-submit-button" id="feedback-submit-btn">Create</button>',
        '</div>',
      '</div>'
    ].join('');
  };

  FeedbackSDK.prototype.getFeedbackListHTML = function() {
    // Mock data for demonstration - replace with API call in production
    var mockFeedback = [
      {
        id: '1',
        title: 'Add dark mode support',
        description: 'Would love to have a dark theme option for better user experience during night time usage.',
        upvotes: 15,
        comments: 3,
        category: 'feature',
        timeAgo: '2 days ago'
      },
      {
        id: '2',
        title: 'Mobile app version',
        description: 'Create a mobile application for iOS and Android platforms.',
        upvotes: 8,
        comments: 1,
        category: 'feature',
        timeAgo: '1 week ago'
      },
      {
        id: '3',
        title: 'Improve loading speed',
        description: 'The application takes too long to load on slower connections.',
        upvotes: 12,
        comments: 5,
        category: 'improvement',
        timeAgo: '3 days ago'
      }
    ];

    return mockFeedback.map(function(item) {
      return [
        '<div class="feedback-item" data-id="' + item.id + '">',
          '<div class="feedback-vote">',
            '<button class="feedback-upvote-btn" data-id="' + item.id + '">▲</button>',
            '<div class="feedback-vote-count">' + item.upvotes + '</div>',
          '</div>',
          '<div class="feedback-content">',
            '<h3 class="feedback-title">' + item.title + '</h3>',
            '<p class="feedback-description">' + item.description + '</p>',
            '<div class="feedback-meta">',
              item.timeAgo + ' • ' + item.comments + ' comments',
              item.category ? ' • ' + item.category : '',
            '</div>',
          '</div>',
        '</div>'
      ].join('');
    }).join('');
  };

  FeedbackSDK.prototype.addFeedbackEventListeners = function() {
    var self = this;
    
    // Search functionality
    var searchInput = document.getElementById('feedback-search');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        self.filterFeedback(e.target.value);
      });
    }

    // Add button
    var addBtn = document.getElementById('feedback-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        self.showFeedbackForm();
      });
    }

    // Upvote buttons
    var upvoteButtons = document.querySelectorAll('.feedback-upvote-btn');
    upvoteButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        self.handleUpvote(this.getAttribute('data-id'));
      });
    });

    // Form handlers
    var backBtn = document.getElementById('feedback-back-btn');
    var cancelBtn = document.getElementById('feedback-cancel-btn');
    var submitBtn = document.getElementById('feedback-submit-btn');

    if (backBtn) {
      backBtn.addEventListener('click', function() {
        self.showFeedbackList();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        self.showFeedbackList();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', function() {
        self.handleSubmitFeedback();
      });
    }
  };

  FeedbackSDK.prototype.filterFeedback = function(searchTerm) {
    var items = document.querySelectorAll('.feedback-item');
    var term = searchTerm.toLowerCase();
    
    items.forEach(function(item) {
      var title = item.querySelector('.feedback-title').textContent.toLowerCase();
      var description = item.querySelector('.feedback-description').textContent.toLowerCase();
      
      if (title.includes(term) || description.includes(term)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  };

  FeedbackSDK.prototype.showFeedbackForm = function() {
    var list = document.getElementById('feedback-list');
    var form = document.getElementById('feedback-form');
    
    if (list) list.style.display = 'none';
    if (form) form.style.display = 'block';
  };

  FeedbackSDK.prototype.showFeedbackList = function() {
    var list = document.getElementById('feedback-list');
    var form = document.getElementById('feedback-form');
    
    if (list) list.style.display = 'block';
    if (form) form.style.display = 'none';
    
    // Clear form
    var titleInput = document.getElementById('feedback-title');
    var descInput = document.getElementById('feedback-description');
    var categorySelect = document.getElementById('feedback-category');
    
    if (titleInput) titleInput.value = '';
    if (descInput) descInput.value = '';
    if (categorySelect) categorySelect.value = '';
  };

  FeedbackSDK.prototype.handleUpvote = function(feedbackId) {
    // In production, this would make an API call
    console.log('Upvoting feedback:', feedbackId);
    
    // Update UI optimistically
    var btn = document.querySelector('.feedback-upvote-btn[data-id="' + feedbackId + '"]');
    if (btn) {
      var countEl = btn.parentNode.querySelector('.feedback-vote-count');
      if (countEl) {
        var currentCount = parseInt(countEl.textContent) || 0;
        countEl.textContent = currentCount + 1;
      }
    }
  };

  FeedbackSDK.prototype.handleSubmitFeedback = function() {
    var titleInput = document.getElementById('feedback-title');
    var descInput = document.getElementById('feedback-description');
    var categorySelect = document.getElementById('feedback-category');
    
    var title = titleInput ? titleInput.value.trim() : '';
    var description = descInput ? descInput.value.trim() : '';
    var category = categorySelect ? categorySelect.value : '';
    
    if (!title || !description) {
      alert('Please fill in both title and description');
      return;
    }
    
    // In production, this would make an API call
    console.log('Submitting feedback:', { title: title, description: description, category: category });
    
    // Show success message and return to list
    alert('Thank you for your feedback!');
    this.showFeedbackList();
  };

  // Public methods
  FeedbackSDK.prototype.open = function() {
    this.openWidget();
  };

  FeedbackSDK.prototype.close = function() {
    this.closeWidget();
  };

  FeedbackSDK.prototype.destroy = function() {
    if (this.widget) {
      this.widget.remove();
      this.widget = null;
    }
  };

  FeedbackSDK.prototype.updateConfig = function(newConfig) {
    this.config = Object.assign(this.config, newConfig);
    this.destroy();
    this.createWidget();
  };

  // Make it globally available
  window.FeedbackSDK = FeedbackSDK;
})();