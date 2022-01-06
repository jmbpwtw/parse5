import assert from 'assert';
import * as fs from 'fs';
import * as parse5 from '../../packages/parse5/lib/index.js';
import { generateTestsForEachTreeAdapter, getStringDiffMsg } from './common.js';

export function generateSeriliazerTests(name, prefix, serialize) {
    const data = fs.readFileSync(new URL('../data/serialization/tests.json', import.meta.url));
    const tests = JSON.parse(data);

    generateTestsForEachTreeAdapter(name, (_test, treeAdapter) => {
        tests.forEach((test, idx) => {
            _test[`${prefix} - ${idx}.${test.name}`] = async () => {
                const opts = { treeAdapter: treeAdapter };
                const document = parse5.parse(test.input, opts);
                const serializedResult = await serialize(document, opts);

                //NOTE: use ok assertion, so output will not be polluted by the whole content of the strings
                assert.ok(serializedResult === test.expected, getStringDiffMsg(serializedResult, test.expected));
            };
        });
    });
}
