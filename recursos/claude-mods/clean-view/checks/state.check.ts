import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createState, command } from '../hooks/state.ts';
test('OFF by default; explicit on/off and invalid arguments preserve state', () => {
 const s = createState(); assert.equal(s.enabled, false);
 assert.match(command(s, 'on'), /ON/); assert.equal(s.enabled, true);
 assert.match(command(s, 'nonsense'), /Usage/); assert.equal(s.enabled, true);
 assert.match(command(s, 'off'), /OFF/); assert.equal(s.enabled, false);
 command(s, ''); assert.equal(s.enabled, true);
});
