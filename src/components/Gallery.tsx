import { Gallery as G, Item } from 'react-photoswipe-gallery'
import { Image } from '../SanityContentRetriever'
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
                    const thumbUrl = img.image.url + "?w=616"
                    return (
                        <Item
                            width={img.image.metadata.dimensions.width}
                            height={img.image.metadata.dimensions.height}
                            thumbnail={thumbUrl}
                            original={img.image.url}
                            key={img.image.url}
                        >
                            {({ ref, open }) => (
                                <img className="cursor-pointer" ref={ref} onClick={open} src={img.image.url} alt={img.alt} />
                            )}
                        </Item>
                    )
                })}
            </G>
        </section>
    )
}
