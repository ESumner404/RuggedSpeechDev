import { render } from 'preact';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { controllerSpec } from '../platform/linkStatus';
import { ControllerScreen } from './ControllerScreen';

describe('the game controller', () => {
  afterEach(() => {
    controllerSpec.value = null;
    document.body.innerHTML = '';
  });

  it('shows the question and the buttons in the order the television gave them, and sends a press', () => {
    controllerSpec.value = {
      game: 'silly',
      prompt: 'Who?',
      yourTurn: true,
      buttons: [
        { id: 'o0', label: 'Grandad', emoji: '👴', colour: 0xfef08a },
        { id: 'o1', label: 'Mum', emoji: '👩', colour: 0xfef08a },
      ],
    };
    const onPress = vi.fn();
    const root = document.createElement('div');
    render(<ControllerScreen onPress={onPress} />, root);
    expect(root.textContent).toContain('Who?');
    expect(root.textContent).toContain('Your turn');
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('.controller-screen__button'));
    expect(buttons.map((b) => b.textContent)).toEqual(['👴Grandad', '👩Mum']);
    buttons[1]!.click();
    expect(onPress).toHaveBeenCalledWith('o1');
    Array.from(root.querySelectorAll('button')).find((b) => b.textContent === 'Stop the game')!.click();
    expect(onPress).toHaveBeenLastCalledWith('quit');
  });

  it('says so when it is not this person’s turn, and when there is no game', () => {
    controllerSpec.value = { game: 'g', prompt: 'Pick', yourTurn: false, buttons: [{ id: 'a', label: 'A', emoji: '', colour: 0 }] };
    const root = document.createElement('div');
    render(<ControllerScreen onPress={() => undefined} />, root);
    expect(root.textContent).toContain('Waiting for the others');
    controllerSpec.value = null;
    const other = document.createElement('div');
    render(<ControllerScreen onPress={() => undefined} />, other);
    expect(other.textContent).toContain('No game on the television');
  });
});
