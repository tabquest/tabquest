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
          socialProfiles: {
            linkedin: '',
            github: '',
            twitter: '',
            instagram: '',
            reddit: '',
          },
        },
      },
    });
    expect(screen.getByText('TestUser')).toBeInTheDocument();
  });
});
