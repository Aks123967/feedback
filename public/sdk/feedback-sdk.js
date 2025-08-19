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
    this.feedbackData = [];
    this.labels = [];
    this.currentView = 'list'; // 'list', 'form', 'detail'
    this.selectedFeedback = null;
    
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
    this.loadLabels();
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
      
      '.feedback-content-text {',
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
      
      '.feedback-labels {',
        'display: flex;',
        'gap: 4px;',
        'margin-top: 4px;',
      '}',
      
      '.feedback-label {',
        'padding: 2px 6px;',
        'border-radius: 12px;',
        'font-size: 10px;',
        'font-weight: 500;',
      '}',
      
      '.feedback-label-red { background: #fee2e2; color: #dc2626; }',
      '.feedback-label-blue { background: #dbeafe; color: #2563eb; }',
      '.feedback-label-green { background: #dcfce7; color: #16a34a; }',
      '.feedback-label-yellow { background: #fef3c7; color: #d97706; }',
      '.feedback-label-purple { background: #f3e8ff; color: #9333ea; }',
      '.feedback-label-gray { background: #f3f4f6; color: #6b7280; }',
      
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
      
      '.feedback-input, .feedback-textarea, .feedback-select {',
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

  // API helper function with CORS handling
  FeedbackSDK.prototype.makeApiRequest = function(url, options) {
    var self = this;
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      
      // Set up the request
      xhr.open(options.method || 'GET', url, true);
      
      // Set CORS headers
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      // Add API key if provided
      if (self.config.apiKey) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + self.config.apiKey);
      }
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              var response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              resolve(xhr.responseText);
            }
          } else {
            reject(new Error('Request failed with status: ' + xhr.status));
          }
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('Network error'));
      };
      
      // Send the request
      if (options.body) {
        xhr.send(JSON.stringify(options.body));
      } else {
        xhr.send();
      }
    });
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

  // Load labels from localStorage (synced with main app)
  FeedbackSDK.prototype.loadLabels = function() {
    try {
      // Default labels that match the main app
      this.labels = [
        { id: '1', name: 'FIX', color: 'red' },
        { id: '2', name: 'ANNOUNCEMENT', color: 'blue' },
        { id: '3', name: 'IMPROVEMENT', color: 'green' },
        { id: '4', name: 'FEATURE', color: 'purple' },
        { id: '5', name: 'BUG', color: 'yellow' }
      ];
    } catch (error) {
      console.error('Error loading labels:', error);
    }
  };

  // Load feedback data from localStorage (synced with main app)
  FeedbackSDK.prototype.loadFeedbackData = function() {
    try {
      var self = this;
      
      // Always use localStorage for now to ensure sync with main app
      this.loadFromLocalStorage();
    } catch (error) {
      console.error('Error loading feedback data:', error);
      this.loadFromLocalStorage();
    }
  };

  // Fallback to localStorage
  FeedbackSDK.prototype.loadFromLocalStorage = function() {
    try {
      var stored = localStorage.getItem('feedback-requests');
      if (stored) {
        var parsed = JSON.parse(stored);
        // Filter only public requests and convert dates
        this.feedbackData = parsed.filter(function(req) {
          return req.status === 'public';
        }).map(function(req) {
          return {
            id: req.id,
            title: req.title,
            summary: req.summary,
            status: req.status,
            upvotes: req.upvotes || [],
            comments: (req.comments || []).filter(function(comment) {
              return comment.isPublic;
            }),
            labels: req.labels || [],
            createdAt: typeof req.createdAt === 'string' ? new Date(req.createdAt) : req.createdAt,
            author: req.author
          };
        });
      } else {
        this.feedbackData = [];
      }
      this.showFeedbackList();
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      this.feedbackData = [];
      this.showFeedbackList();
    }
  };
  // Save feedback data to localStorage (synced with main app)
  FeedbackSDK.prototype.saveFeedbackData = function(newFeedback) {
    try {
      var self = this;
      
      // Always use localStorage to ensure sync with main app
      this.saveToLocalStorage(newFeedback);
    } catch (error) {
      console.error('Error saving feedback data:', error);
      this.saveToLocalStorage(newFeedback);
    }
  };

  // Fallback save to localStorage
  FeedbackSDK.prototype.saveToLocalStorage = function(newFeedback) {
    try {
      var stored = localStorage.getItem('feedback-requests');
      var allFeedback = stored ? JSON.parse(stored) : [];
      
      // Create complete feedback object with all required fields
      var completeFeedback = {
        id: newFeedback.id || Date.now().toString(),
        title: newFeedback.title,
        summary: newFeedback.summary || newFeedback.description,
        status: newFeedback.status || 'public',
        author: newFeedback.author || 'Anonymous User',
        labels: newFeedback.labels || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: newFeedback.upvotes || [],
        comments: newFeedback.comments || []
      };
      
      // Add new feedback
      allFeedback.unshift(completeFeedback);
      
      // Save back to localStorage
      localStorage.setItem('feedback-requests', JSON.stringify(allFeedback));
      
      // Trigger storage event for main app to update
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'feedback-requests',
        newValue: JSON.stringify(allFeedback),
        storageArea: localStorage
      }));
      
      // Reload our filtered data
      this.loadFeedbackData();
      
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  // Update upvote in localStorage
  FeedbackSDK.prototype.updateUpvote = function(feedbackId) {
    try {
      var self = this;
      
      // Always use localStorage to ensure sync with main app
      this.upvoteLocalStorage(feedbackId);
    } catch (error) {
      console.error('Error updating upvote:', error);
      this.upvoteLocalStorage(feedbackId);
    }
  };

  // Fallback upvote to localStorage
  FeedbackSDK.prototype.upvoteLocalStorage = function(feedbackId) {
    try {
      var stored = localStorage.getItem('feedback-requests');
      if (!stored) return;
      
      var allFeedback = JSON.parse(stored);
      var feedbackIndex = allFeedback.findIndex(function(req) {
        return req.id === feedbackId;
      });
      
      if (feedbackIndex !== -1) {
        var newUpvote = {
          id: Date.now().toString(),
          userId: 'widget-user-' + Date.now(),
          userName: 'Anonymous User',
          createdAt: new Date().toISOString()
        };
        
        if (!allFeedback[feedbackIndex].upvotes) {
          allFeedback[feedbackIndex].upvotes = [];
        }
        
        allFeedback[feedbackIndex].upvotes.push(newUpvote);
        allFeedback[feedbackIndex].updatedAt = new Date().toISOString();
        
        localStorage.setItem('feedback-requests', JSON.stringify(allFeedback));
        
        // Trigger storage event for main app to update
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'feedback-requests',
          newValue: JSON.stringify(allFeedback),
          storageArea: localStorage
        }));
        
        this.loadFeedbackData();
      }
    } catch (error) {
      console.error('Error updating upvote in localStorage:', error);
    }
  };
  FeedbackSDK.prototype.loadFeedbackContent = function() {
    var content = document.getElementById('feedback-content');
    if (!content) return;
    
    this.loadFeedbackData();
  };

  FeedbackSDK.prototype.showFeedbackList = function() {
    var content = document.getElementById('feedback-content');
    if (!content) return;
    
    this.currentView = 'list';
    content.innerHTML = this.getFeedbackListHTML();
    this.addFeedbackEventListeners();
  };

  FeedbackSDK.prototype.getFeedbackListHTML = function() {
    var html = [
      '<div class="feedback-widget-content">',
        '<div class="feedback-search-bar">',
          '<input type="text" class="feedback-search-input" placeholder="Search ideas..." id="feedback-search">',
          '<button class="feedback-add-button" id="feedback-add-btn">+</button>',
        '</div>',
        '<div class="feedback-list" id="feedback-list">'
    ];

    if (this.feedbackData.length === 0) {
      html.push('<div class="feedback-empty">No feedback found. Be the first to share an idea!</div>');
    } else {
      var self = this;
      this.feedbackData.forEach(function(item) {
        var timeAgo = self.formatTimeAgo(item.createdAt);
        var labelsHtml = '';
        
        if (item.labels && item.labels.length > 0) {
          labelsHtml = '<div class="feedback-labels">';
          item.labels.forEach(function(label) {
            labelsHtml += '<span class="feedback-label feedback-label-' + label.color + '">' + label.name + '</span>';
          });
          labelsHtml += '</div>';
        }

        html.push([
          '<div class="feedback-item" data-id="' + item.id + '">',
            '<div class="feedback-vote">',
              '<button class="feedback-upvote-btn" data-id="' + item.id + '">▲</button>',
              '<div class="feedback-vote-count">' + (item.upvotes ? item.upvotes.length : 0) + '</div>',
            '</div>',
            '<div class="feedback-content-text">',
              '<h3 class="feedback-title">' + self.escapeHtml(item.title) + '</h3>',
              '<p class="feedback-description">' + self.escapeHtml(item.summary) + '</p>',
              '<div class="feedback-meta">',
                timeAgo + ' • ' + (item.comments ? item.comments.length : 0) + ' comments',
              '</div>',
              labelsHtml,
            '</div>',
          '</div>'
        ].join(''));
      }.bind(this));
    }

    html.push('</div></div>');
    return html.join('');
  };

  FeedbackSDK.prototype.showFeedbackForm = function() {
    var content = document.getElementById('feedback-content');
    if (!content) return;
    
    this.currentView = 'form';
    
    var labelsOptions = '';
    this.labels.forEach(function(label) {
      labelsOptions += '<option value="' + label.id + '">' + label.name + '</option>';
    });

    content.innerHTML = [
      '<div class="feedback-form">',
        '<div class="feedback-form-header">',
          '<button class="feedback-back-button" id="feedback-back-btn">← Back</button>',
          '<h3>Share Idea</h3>',
        '</div>',
        '<input type="text" class="feedback-input" placeholder="Title" id="feedback-title" required>',
        '<textarea class="feedback-textarea" placeholder="Describe your idea" id="feedback-description" rows="4" required></textarea>',
        '<select class="feedback-select" id="feedback-category">',
          '<option value="">Select Category (Optional)</option>',
          labelsOptions,
        '</select>',
        '<div class="feedback-form-actions">',
          '<button class="feedback-cancel-button" id="feedback-cancel-btn">Cancel</button>',
          '<button class="feedback-submit-button" id="feedback-submit-btn">Create</button>',
        '</div>',
      '</div>'
    ].join('');
    
    this.addFormEventListeners();
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

    // Feedback item clicks
    var feedbackItems = document.querySelectorAll('.feedback-item');
    feedbackItems.forEach(function(item) {
      item.addEventListener('click', function() {
        var feedbackId = this.getAttribute('data-id');
        self.showFeedbackDetail(feedbackId);
      });
    });
  };

  FeedbackSDK.prototype.addFormEventListeners = function() {
    var self = this;
    
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

  FeedbackSDK.prototype.handleUpvote = function(feedbackId) {
    this.updateUpvote(feedbackId);
    
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
    var categoryId = categorySelect ? categorySelect.value : '';
    
    if (!title || !description) {
      alert('Please fill in both title and description');
      return;
    }
    
    var selectedLabel = null;
    if (categoryId) {
      selectedLabel = this.labels.find(function(label) {
        return label.id === categoryId;
      });
    }
    
    var newFeedback = {
      id: Date.now().toString(),
      title: title,
      summary: description,
      description: description,
      status: 'public',
      author: 'Anonymous User',
      labels: selectedLabel ? [selectedLabel] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: [],
      comments: []
    };
    
    this.saveFeedbackData(newFeedback);
    alert('Thank you for your feedback!');
    this.showFeedbackList();
  };

  FeedbackSDK.prototype.showFeedbackDetail = function(feedbackId) {
    var feedback = this.feedbackData.find(function(item) {
      return item.id === feedbackId;
    });
    
    if (!feedback) return;
    
    this.selectedFeedback = feedback;
    this.currentView = 'detail';
    
    var content = document.getElementById('feedback-content');
    if (!content) return;
    
    var self = this;
    var timeAgo = this.formatTimeAgo(feedback.createdAt);
    var labelsHtml = '';
    
    if (feedback.labels && feedback.labels.length > 0) {
      labelsHtml = '<div class="feedback-labels">';
      feedback.labels.forEach(function(label) {
        labelsHtml += '<span class="feedback-label feedback-label-' + label.color + '">' + label.name + '</span>';
      });
      labelsHtml += '</div>';
    }

    var commentsHtml = '';
    if (feedback.comments && feedback.comments.length > 0) {
      commentsHtml = '<div style="margin-top: 16px;"><h4 style="margin-bottom: 8px;">Comments</h4>';
      feedback.comments.forEach(function(comment) {
        var commentTime = new Date(comment.createdAt);
        commentsHtml += [
          '<div style="background: #f9fafb; padding: 12px; border-radius: 8px; margin-bottom: 8px;">',
            '<div style="font-weight: 600; font-size: 12px; color: #374151; margin-bottom: 4px;">' + comment.author + '</div>',
            '<div style="font-size: 14px; color: #6b7280;">' + comment.content + '</div>',
            '<div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">' + this.formatTimeAgo(commentTime) + '</div>',
          '</div>'
        ].join('');
      });
      commentsHtml += '</div>';
    }

    content.innerHTML = [
      '<div class="feedback-form">',
        '<div class="feedback-form-header">',
          '<button class="feedback-back-button" id="feedback-detail-back-btn">← Back to Ideas</button>',
        '</div>',
        '<div style="display: flex; align-items: start; gap: 12px; margin-bottom: 16px;">',
          '<div style="display: flex; flex-direction: column; align-items: center;">',
            '<button class="feedback-upvote-btn" id="feedback-detail-upvote" data-id="' + feedback.id + '">▲</button>',
            '<div class="feedback-vote-count">' + (feedback.upvotes ? feedback.upvotes.length : 0) + '</div>',
          '</div>',
          '<div style="flex: 1;">',
            '<h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">' + self.escapeHtml(feedback.title) + '</h2>',
            '<div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">' + timeAgo + ' • ' + (feedback.comments ? feedback.comments.length : 0) + ' comments</div>',
            '<p style="margin: 0 0 8px 0; color: #374151; line-height: 1.5;">' + self.escapeHtml(feedback.summary) + '</p>',
            labelsHtml,
          '</div>',
        '</div>',
        commentsHtml,
      '</div>'
    ].join('');
    
    this.addDetailEventListeners();
  };

  FeedbackSDK.prototype.addDetailEventListeners = function() {
    var self = this;
    
    var backBtn = document.getElementById('feedback-detail-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        self.showFeedbackList();
      });
    }

    var upvoteBtn = document.getElementById('feedback-detail-upvote');
    if (upvoteBtn) {
      upvoteBtn.addEventListener('click', function() {
        self.handleUpvote(this.getAttribute('data-id'));
      });
    }
  };

  FeedbackSDK.prototype.formatTimeAgo = function(date) {
    // Handle both string and Date objects
    if (typeof date === 'string') {
      date = new Date(date);
    }
    
    var now = new Date();
    var diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' minutes ago';
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago';
    if (diffInSeconds < 2592000) return Math.floor(diffInSeconds / 86400) + ' days ago';
    if (diffInSeconds < 31536000) return Math.floor(diffInSeconds / 2592000) + ' months ago';
    return Math.floor(diffInSeconds / 31536000) + ' years ago';
  };

  FeedbackSDK.prototype.escapeHtml = function(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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