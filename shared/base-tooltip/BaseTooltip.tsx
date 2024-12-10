import { useEffect, useState } from 'react';

import ReactDOM from 'react-dom';
import ReactTooltip, { TooltipProps as ReactTooltipProps } from 'react-tooltip';

import { cn } from '@/lib/utils';

export interface BaseTooltipProps
  extends Pick<ReactTooltipProps, 'place' | 'delayShow' | 'delayHide' | 'disable' | 'effect'> {
  // provide a unique ID for each tooltip
  id: string;
  className?: string;
  children: JSX.Element;
  // data-tip only accepts a string, data-html supports HTML, both are setup
  message: string;
  /**  Determine if the tooltip should be placed in a React Portal or not.
   * Currently, some tooltips are misplaced or not being shown because they are put inside the React Portal
   */
  shouldRenderInPortal?: boolean;
}

// Wrapper component to portal React tooltips
const BodyPortal = ({ children }: { children: React.ReactNode }): React.JSX.Element | null => {
  const [domNode, setDomNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const node = document.createElement('div');

      node.setAttribute('data-testid', 'body-portal');
      document.body.appendChild(node);

      setDomNode(node);

      return (): void => {
        document.body.removeChild(node);
      };
    }
  }, []);

  if (!domNode) {
    return null; // Avoid rendering until the DOM node is ready
  }

  return ReactDOM.createPortal(children, domNode);
};

const BaseTooltip = ({
  id,
  className,
  children,
  message,
  place,
  delayShow,
  delayHide,
  disable,
  effect = 'solid',
  shouldRenderInPortal = true,
}: BaseTooltipProps): JSX.Element => {
  const reactTooltip = (
    <ReactTooltip
      backgroundColor='#272C35'
      className={cn('!opacity-100 !px-2 !py-3 text-center bg-gray-800 text-white rounded-xl shadow-lg', className)}
      effect={effect}
      id={id}
    />
  );

  return (
    <>
      <div data-testid='tooltip-wrapper'>
        {!shouldRenderInPortal ? reactTooltip : null}
        <div
          data-html
          data-delay-hide={delayHide || 100}
          data-delay-show={delayShow || 100}
          data-for={id}
          data-place={place || 'bottom'}
          data-tip={message}
          data-tip-disable={disable || false}
        >
          {children}
        </div>
      </div>
      {shouldRenderInPortal ? <BodyPortal>{reactTooltip}</BodyPortal> : null}
    </>
  );
};

export default BaseTooltip;
