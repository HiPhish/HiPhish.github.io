import Code from './Code.astro';

export default {
	title: 'Molecule/Code',
	component: Code,
	args: {
	}
};

export const C = {
	args: {
		lang: 'c',
		code: `float Q_rsqrt( float number )
{
	long i;
	float x2, y;
	const float threehalfs = 1.5F;

	x2 = number * 0.5F;
	y  = number;
	i  = * ( long * ) &y;                       // evil floating point bit level hacking
	i  = 0x5f3759df - ( i >> 1 );               // what the fuck?
	y  = * ( float * ) &i;
	y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration
//	y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed

	return y;
}`
	}
};

export const Lisp = {
	args: {
		lang: 'lisp',
		code: `(defun add (x y)
  "Recursively add two numbers X and Y."
  (if (zerop y)
    x
    (add (1+ x) (1- y)))) `
	}
}

export const Lua = {
	args: {
		lang: 'lua',
		code: `local function add(x, y)
    if y == 0 then
        return x
    else
    	return add(x + 1, y - 1)
    end
end`
	}
}

export const Python = {
	args: {
		lang: 'c',
		code: `def fizz_buzz(n: int) -> str | int:
    if n % 5 == 0 and n % 3 == 0:
        return 'fizzbuzz'
    if n % 3 == 0:
    	return 'fizz'
    if n % 5 == 0:
    	return 'buzz'
    return n`
	}
}
