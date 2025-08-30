import getComponentName from './getComponentName';
import { Target } from '../types';

export default function generateDisplayName(target: Target): string {
    return typeof target === 'string' ? `styled.${target}` : `Styled(${getComponentName(target)})`;
}