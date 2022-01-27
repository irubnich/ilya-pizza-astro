import { Gallery as G, Item } from 'react-photoswipe-gallery'
import { Image } from '../PrismicContentRetriever'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

interface Props {
    images: Image[]
}

export default function Gallery(props: Props) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <G shareButton={false}>
                {props.images.map(img => {
                    return (
                        <Item
                            width={img.image.dimensions.width}
                            height={img.image.dimensions.height}
                            thumbnail={img.image.url}
                            original={img.image.url}
                            key={img.image.url}
                        >
                            {({ ref, open }) => (
                                <img className="cursor-pointer" ref={ref} onClick={open} src={img.image.url} alt={img.image.alt} />
                            )}
                        </Item>
                    )
                })}
            </G>
        </section>
    )
}
