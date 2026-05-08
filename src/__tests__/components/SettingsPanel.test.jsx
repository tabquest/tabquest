import { render, screen } from '../test-utils';
import '@testing-library/jest-dom';
import SettingsPanel from '../../components/SettingsPanel';

jest.mock('../../utils/hooks/useExtensionVersion', () => () => '1.5.0');

describe('SettingsPanel', () => {
  it('renders the settings button when closed', () => {
    render(<SettingsPanel />);
    expect(screen.getByTitle(/open settings/i)).toBeInTheDocument();
  });
});
