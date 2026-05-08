import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import SocialPopover from '../../components/SocialPopover';

describe('SocialPopover', () => {
  it('renders user name from settings', () => {
    render(<SocialPopover />, {
      preloadedState: {
        settings: {
          userName: 'TestUser',
          userRole: 'Developer',
          userPortfolioUrl: '',
          theme: 'midnight_default',
          searchEngine: 'Google',
          weatherLocation: 'Chennai',
          hideSeconds: false,
          use12Hour: false,
          socialProfiles: {
            linkedin: '',
            github: '',
            twitter: '',
            instagram: '',
            reddit: '',
          },
          bookmarks: [],
        },
      },
    });
    expect(screen.getByText('TestUser')).toBeInTheDocument();
  });
});
