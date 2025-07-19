import {
  Directive,
  Input,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  inject
} from '@angular/core';

@Directive({
  selector: '[simpleTooltip]',
  standalone: true
})
export class SimpleTooltipDirective implements OnDestroy {
  @Input('simpleTooltip') tooltipText = '';

  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private tooltipElement: HTMLElement | null = null;
  private showTimeout: any;
  private hideTimeout: any;
  private isCopied = false;

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this.showTimeout = setTimeout(() => {
      this.showTooltip();
    }, 300);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, 100);
  }

  private showTooltip() {
    if (this.tooltipElement) {
      return;
    }

    // Create tooltip container
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'simple-custom-tooltip');

    // Create text span
    const textSpan = this.renderer.createElement('span');
    this.renderer.addClass(textSpan, 'tooltip-text');
    const displayText = this.isCopied ? '✅ Copied!' : this.tooltipText;
    const textNode = this.renderer.createText(displayText);
    this.renderer.appendChild(textSpan, textNode);

    // Create copy button only if not copied
    if (!this.isCopied) {
      const copyButton = this.renderer.createElement('button');
      this.renderer.addClass(copyButton, 'copy-btn');
      this.renderer.setAttribute(copyButton, 'title', 'Copy');

      const copyIcon = this.renderer.createElement('span');
      const iconText = this.renderer.createText('📋');
      this.renderer.appendChild(copyIcon, iconText);
      this.renderer.appendChild(copyButton, copyIcon);

      this.renderer.listen(copyButton, 'click', () => {
        this.copyToClipboard(this.tooltipText);
      });

      this.renderer.appendChild(this.tooltipElement, copyButton);
    }

    this.renderer.appendChild(this.tooltipElement, textSpan);
    this.renderer.appendChild(document.body, this.tooltipElement);
    this.positionTooltip();

    // Keep tooltip open on hover
    this.renderer.listen(this.tooltipElement, 'mouseenter', () => {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
    });

    this.renderer.listen(this.tooltipElement, 'mouseleave', () => {
      this.hideTimeout = setTimeout(() => {
        this.hideTooltip();
      }, 100);
    });
  }

  private positionTooltip() {
    if (!this.tooltipElement) return;

    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    let top = hostRect.top - tooltipRect.height - 8;
    let left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;

    if (top < 0) {
      top = hostRect.bottom + 8;
    }

    if (left < 0) {
      left = 8;
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 8;
    }

    this.renderer.setStyle(this.tooltipElement, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipElement, 'top', `${top + window.scrollY}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipElement, 'z-index', '10000');
  }

  private hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  private async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied:', text);
      this.isCopied = true;
      this.hideTooltip();
      this.showTooltip();

      setTimeout(() => {
        this.isCopied = false;
        this.hideTooltip();
      }, 1500);
    } catch (err) {
      console.error('Copy failed, fallback:', err);
      this.fallbackCopyTextToClipboard(text);
    }
  }

  private fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      console.log('Copied (fallback):', text);
      this.isCopied = true;
      this.hideTooltip();
      this.showTooltip();

      setTimeout(() => {
        this.isCopied = false;
        this.hideTooltip();
      }, 1500);
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textArea);
  }

  ngOnDestroy() {
    this.hideTooltip();
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
