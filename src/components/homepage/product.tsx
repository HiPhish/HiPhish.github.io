interface ProductProps {
	title: string,
	url: string,
	img: string,
	alt: string,
	description: string,
}

export default ({title, url, img, alt, description}: ProductProps) => {
	return <article>
		<h3>{title}</h3>
		<p>
			{description}
		</p>
		<img src={img} alt={alt} />
		<p class="link">
			<a href={url}>Learn more</a>
		</p>
	</article>
}
