import { Gallery as G, Item } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

interface Props {
    images: [string]
}

const getPath = (img: string): string => {
    return `/assets/img/gallery/${img}`
}

export default function Gallery(props: Props) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <G shareButton={false}>
                {props.images.map(img => {
                    return (
                        <Item
                            width="2048"
                            height="1365"
                            original={getPath(img)}
                            key={img}
                        >
                            {({ ref, open }) => (
                                <img id={img} ref={ref} onClick={open} src={getPath(img)} />
                            )}
                        </Item>
                    )
                })}
            </G>
        </section>
    )
}
