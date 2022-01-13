interface Props {
    alt?: string
    src: string
}

export default function ImageWithCaption(props: Props) {
    return (
        <figure>
            <img alt={props.alt} src={props.src} />
            <figcaption>{props.alt}</figcaption>
        </figure>
    )
}
