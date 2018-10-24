import { ExampleController } from "controllers/example/exampleController";
import "jest"

function isTrue(b: boolean) {
    return b;
}

test('isTrue(true) should be true ', () => {
  expect(isTrue(true)).toBe(true);
});
