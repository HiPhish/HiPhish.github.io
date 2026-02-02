import type { JSX } from "preact/jsx-runtime";

interface PluginProps {
	title: string,
	url: string,
	description: JSX.Element,
}

export const vimPlugins: PluginProps[] = [
	{
		title: 'Guile.vim',
		url: 'https://gitlab.com/HiPhish/guile.vim',
		description: <>
			<p>
				<a href="http://www.gnu.org/software/guile/">GNU Guile</a> is
				an implementation of the Scheme programming language and the
				official extension language of the 
				<a href="http://www.gnu.org/">GNU project</a>.
				Like all Scheme implementations it adds its own extensions on
				top of Scheme. This plugin automatically detects whether a
				Scheme file is a Guile program and adds syntax highlighting for
				special Guile forms.
			</p>
			<p>
				The file type of Guile buffers will be <code>scheme.guile</code>,
				this way users can keep using their existing Scheme plugins and
				settings while still making use of Guile-exclusive plugins and
				settings.
			</p>
		</>
	}, {
		title: 'Info.vim',
		url: 'https://gitlab.com/HiPhish/info.vim',
		description: <>
			<p>
				Read document in the Info format from inside Vim.
				<a href="http://www.gnu.org/software/texinfo/">GNU Texinfo</a> is
				the official format for writing documentation for
				<a href="http://www.gnu.org/">GNU</a> project such as
				<a href="http://www.gnu.org/software/bash/">Bash</a> or
				<a href="http://www.gnu.org/software/make/">GNU Make</a>, but
				it is also used by a number of other projects not part of GNU.
			</p>
			<p>
				Info is the on-line format produced by Texinfo and
				traditionally it was read using either a standalone terminal
				application or Emacs. With Info.vim you get a first-class Vim
				experience. The plugin provides a way of reading documents and
				an API for building upon it.
			</p>
		</>
	}, {
		title: 'Jinja.vim',
		url: 'https://gitlab.com/HiPhish/jinja.vim',
		description: <>
			<p>
				Adds better integration for <a href="http://jinja.pocoo.org/">Jinja</a>
				templates by augmenting the existing file type with <code>.jinja</code>.
				This way you could have for for example an HTML- and a TeX file
				with Jinja snippets and their extensions would be <code>html.jinja</code>
				respectively.
			</p>
			<p>
				This is useful because it allows users to keep their settings
				and plugins for the parent file type. In contrast, the
				<a href="https://www.vim.org/scripts/script.php?script_id=1856">
					official plugin
				</a> sets the file type to <code>jinaj</code> or <code>htmljinja</code> instead.
			</p>
		</>
	}, {
		title: 'ncm2-vlime',
		url: 'https://gitlab.com/HiPhish/ncm2-vlime',
		description: <p>
			A plugin for <a href="https://github.com/ncm2/ncm2/">NCM2</a> (a
			completion manager) which provides asynchronous completion of
			Common Lisp source code. It uses the
			<a href="https://github.com/l04m33/vlime/">Vlime</a> plugin
			to get completion candidates.
		</p>
	},
];

export const nvimPlugins: PluginProps[] = [
	{
		title: 'Awk-ward.nvim',
		url: 'https://gitlab.com/HiPhish/awk-ward.nvim',
		description: <p>
			Turn your Neovim into an interactive Awk development environment.
			You can edit your Awk scripts, edit the input text, and see the
			result displayed immediately in an output buffer.
		</p>,
	}, {
		title: 'Debugpy.nvim',
		url: 'https://gitlab.com/HiPhish/debugpy.nvim',
		description: <p>
			A frontend to <a href="https://github.com/mfussenegger/nvim-dap">nvim-dap</a>,
			that dynamically creates configuration for the Python debug adapter <a href="https://github.com/microsoft/debugpy">
				debugpy
			</a>. It does its best to always do The Right Thing for the most
			common use-cases, but an escape hatch is provided so users can
			define their own sub-commands.
		</p>,
	}, {
		title: 'desktop-notify.nvim',
		url: 'https://gitlab.com/HiPhish/desktop-notify.nvim',
		description: <p>
			Use your desktop's native notification system for Neovim
			notifications.
		</p>,
	}, {
		title: 'Neovim.rkt',
		url: 'https://gitlab.com/HiPhish/neovim.rkt',
		description: <>
			<p>
				Neovim remote client for <a href="https://racket-lang.org/">Racket</a>.
				It allows you to control Neovim from Racket and write Neovim
				plugins in Racket instead of Vimscript.
			</p>
			<p>
				This is both a Racket library, as well as a Neovim plugin, so
				you will need to install it twice, or set it up such that both
				programs can find it. The installation instructions explain it
				all.
			</p>
		</>,
	}, {
		title: 'nvim-ts-rainbow2',
		url: 'https://gitlab.com/HiPhish/nvim-ts-rainbow2',
		description: <p>
			Alternating highlighting for text delimiters ("rainbow
			parentheses") powered by Tree-stter. We are not limited to just
			parentheses, a delimiter can be anything, such as a tag in HTML.
			The plugin is very hackable, users can add their own queries and
			highlighting strategies without altering the original source code.
		</p>,
	}, {
		title: 'pycodestyle.nvim',
		url: 'https://gitlab.com/HiPhish/pycodestyle.nvim',
		description: <p>
			Read your <a href="https://pycodestyle.pycqa.org/en/latest/">pycodestyle
			</a> configuration and store it as a dictionary. This plugin is
			useful as a building block in your Neovim configuration: it allows
			you to set your editor settings according to the project's Python
			settings.  Don't try to keep your linter and editor in sync, just
			use your linter configuration as your editor configuration.
		</p>,
	}, {
		title: 'REPL.nvim',
		url: 'https://gitlab.com/HiPhish/repl.nvim',
		description: <>
			<p>
				The poor-man's REPL integration, this plugin aims to provide a
				simple universal interface to all possible REPLs.  It does so
				by building on top of Neovim's terminal emulator, which has its
				limitations, but in return will work with pretty much any REPL.
				If you can run it in a terminal, you can run it in REPL.nvim as
				well.
			</p>
			<p>
				A number of common REPLs are supported out of the box, and the
				exposed API allows users or other plugins to define their own
				REPL setting in a few lines of code.  Settings for existing
				REPLs can be overridden according to one's own personal
				preferences.
			</p>
		</>,
	}, {
		title: 'Quicklisp.nvim',
		url: 'https://gitlab.com/HiPhish/quicklisp.nvim',
		description: <p>
			A Neovim frontend to <a href="https://www.quicklisp.org/">Quicklisp</a>,
			the Common Lisp package manager. It allows users to install, remove
			and query Common Lisp packages straight from the Neovim command line.
		</p>,
	},
];

export default ({title, url, description}: PluginProps) => {
	return <>
		<dt>
			<a href={url}>{title}</a>
		</dt>
		<dd>
			{description}
		</dd>
	</>
}
