// Remove the 'submitted' flag so it thinks you haven't given feedback yet
localStorage.removeItem('tabquest_feedback_submitted');

// Set 'last shown' to 4 days ago (approx 345,600,000 ms in the past)
// This satisfies the condition: (Now - LastShown) > 3.5 days
localStorage.setItem('tabquest_feedback_last_shown', (Date.now() - (4 * 24 * 60 * 60 * 1000)).toString());