import settingsReducer, {
  updateUserInfo,
  updateSearchPreferences,
  updateSocialProfiles,
  updateBookmarks,
  updateTheme,
} from '../utils/redux/settingsSlice';

describe('settingsSlice', () => {
  it('should return initial state with defaults', () => {
    const state = settingsReducer(undefined, { type: 'unknown' });
    expect(state.userName).toBe('user_name');
    expect(state.theme).toBe('midnight_default');
  });

  it('should handle updateUserInfo', () => {
    const state = settingsReducer(
      undefined,
      updateUserInfo({
        userName: 'Alice',
        userRole: 'designer',
        userPortfolioUrl: 'https://alice.dev',
      }),
    );
    expect(state.userName).toBe('Alice');
    expect(state.userRole).toBe('designer');
    expect(state.userPortfolioUrl).toBe('https://alice.dev');
  });

  it('should handle updateSearchPreferences', () => {
    const state = settingsReducer(
      undefined,
      updateSearchPreferences({
        searchEngine: 'Bing',
        weatherLocation: 'Mumbai',
        hideSeconds: true,
        use12Hour: true,
      }),
    );
    expect(state.searchEngine).toBe('Bing');
    expect(state.weatherLocation).toBe('Mumbai');
    expect(state.hideSeconds).toBe(true);
    expect(state.use12Hour).toBe(true);
  });

  it('should handle updateSocialProfiles merging', () => {
    const state = settingsReducer(
      undefined,
      updateSocialProfiles({
        twitter: 'https://twitter.com/alice',
      }),
    );
    expect(state.socialProfiles.twitter).toBe('https://twitter.com/alice');
    expect(state.socialProfiles.github).toBe('https://github.com/tabquest');
  });

  it('should handle updateBookmarks', () => {
    const newBookmarks = [{ url: 'https://example.com', name: 'Example' }];
    const state = settingsReducer(undefined, updateBookmarks(newBookmarks));
    expect(state.bookmarks).toEqual(newBookmarks);
  });

  it('should handle updateTheme with valid theme', () => {
    const state = settingsReducer(undefined, updateTheme('aurora_borealis'));
    expect(state.theme).toBe('aurora_borealis');
  });
});
