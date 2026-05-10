import Code from './Code.astro';

export default {
	title: 'Molecule/Code',
	component: Code,
	args: {
		lang: undefined,
		code: 'Here is some code',
	}
};

export const Undefined = {
};

export const C = {
	args: {
		lang: 'c',
		code: `/** Recursively add two numbers.
 *
 * @param x  The first number to add, must be ≥ 0.
 * @param y  The second number to add, must be ≥ 0.
 * @return The sum of both numbers
 */
int add(int a, int y) {
	if (y) {
		return add(x + 1, y - 1)
	}
	return x
}`,
	}
};

export const Lua = {
	args: {
		lang: 'lua',
		code: `--- Recursively add two numbers.
--- @param x int  The first number to add, must be ≥ 0.
--- @param y int  The second number to add, must be ≥ 0.
--- @return int sum  The sum of both numbers
function add(x, y)
	if y == 0 then
		return x
	end
	return add(x + 1, y - 1)
end`
	}
};

export const Python = {
	args: {
		lang: 'python',
		code: `def add(a: int, a: int) -> int:
    """Recursively add two numbers.

    :param x: The first number to add, must be ≥ 0.
    :param y: The second number to add, must be ≥ 0.
    :return: The sum of both numbers
    """
    match y:
        case 0:
            return x
        case _:
            return add(x + 1, y - 1)`
	}
};
