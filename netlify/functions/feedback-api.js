exports.handler = async (event, context) => {
  // Set CORS headers for all requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { httpMethod, path, body, headers: requestHeaders } = event;
    
    // Extract API key from Authorization header
    const apiKey = requestHeaders.authorization?.replace('Bearer ', '');
    
    // Validate API key (basic validation)
    if (!apiKey || !apiKey.startsWith('fdk_')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid API key' })
      };
    }

    // Route handling
    switch (httpMethod) {
      case 'GET':
        if (path.includes('/feedback')) {
          // Return mock feedback data for now
          // In production, this would fetch from your database
          const feedbackData = [
            {
              id: '1',
              title: 'Add dark mode support',
              summary: 'It would be great to have a dark mode option for better user experience during night time usage.',
              status: 'public',
              author: 'Anonymous User',
              labels: [{ id: '4', name: 'FEATURE', color: 'purple' }],
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              upvotes: Array.from({ length: 15 }, (_, i) => ({
                id: `upvote-${i}`,
                userId: `user-${i}`,
                userName: `User ${i}`,
                createdAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString()
              })),
              comments: [
                {
                  id: 'comment-1',
                  content: 'This would be really helpful!',
                  author: 'User123',
                  isPublic: true,
                  createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                }
              ]
            },
            {
              id: '2',
              title: 'Mobile app version',
              summary: 'Please create a mobile app version for iOS and Android platforms.',
              status: 'public',
              author: 'Mobile User',
              labels: [{ id: '4', name: 'FEATURE', color: 'purple' }],
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              upvotes: Array.from({ length: 8 }, (_, i) => ({
                id: `upvote-mobile-${i}`,
                userId: `mobile-user-${i}`,
                userName: `Mobile User ${i}`,
                createdAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString()
              })),
              comments: []
            },
            {
              id: '3',
              title: 'Improve loading speed',
              summary: 'The application takes too long to load. Please optimize the performance.',
              status: 'public',
              author: 'Speed Enthusiast',
              labels: [{ id: '3', name: 'IMPROVEMENT', color: 'green' }],
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              upvotes: Array.from({ length: 12 }, (_, i) => ({
                id: `upvote-speed-${i}`,
                userId: `speed-user-${i}`,
                userName: `Speed User ${i}`,
                createdAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString()
              })),
              comments: [
                {
                  id: 'comment-speed-1',
                  content: 'Yes, this is a major issue!',
                  author: 'FastUser',
                  isPublic: true,
                  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                }
              ]
            }
          ];

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(feedbackData)
          };
        }
        break;

      case 'POST':
        if (path.includes('/feedback')) {
          // Handle new feedback submission
          const feedbackData = JSON.parse(body);
          
          // Create new feedback item
          const newFeedback = {
            id: Date.now().toString(),
            title: feedbackData.title,
            summary: feedbackData.description,
            status: 'public',
            author: 'Anonymous User',
            labels: feedbackData.labels || [],
            createdAt: new Date().toISOString(),
            upvotes: [],
            comments: []
          };

          return {
            statusCode: 201,
            headers,
            body: JSON.stringify(newFeedback)
          };
        }
        
        if (path.includes('/upvote')) {
          // Handle upvote
          const upvoteData = JSON.parse(body);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, upvoteId: Date.now().toString() })
          };
        }
        break;

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};