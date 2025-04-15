import { cn } from '@/lib/utils';

describe('cn', () => {
  it('should merge simple class names', () => {
    expect(cn('p-2', 'm-2')).toBe('p-2 m-2');
  });

  it('should resolve conflicting Tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('should handle conditional class names', () => {
    const condition = true;

    expect(cn('p-2', condition && 'm-2')).toBe('p-2 m-2');
  });

  it('should skip falsy values', () => {
    expect(cn('p-2', false, null, undefined, '', 0 && 'hidden')).toBe('p-2');
  });

  it('should handle arrays of class names', () => {
    expect(cn(['p-2', 'm-2'], ['text-sm'])).toBe('p-2 m-2 text-sm');
  });

  it('should handle mix of strings, arrays, and objects', () => {
    expect(cn('p-2', ['m-2'], { 'text-sm': true, hidden: false })).toBe('p-2 m-2 text-sm');
  });
});
