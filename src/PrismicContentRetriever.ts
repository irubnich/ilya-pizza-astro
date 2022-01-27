import * as prismic from '@prismicio/client'

interface ImageData {
    url: string
    dimensions: { width: number, height: number },
    alt: string,
}

export interface Image {
    caption: string,
    image: ImageData
}

export default class PrismicContentRetriever {
    client: prismic.Client

    constructor() {
        const repoName = 'ilya-pizza'
        const endpoint = prismic.getEndpoint(repoName)
        this.client = prismic.createClient(endpoint, { fetch })
    }

    async getImages(): Promise<any> {
        const docs = await this.client.getAllByType('photo')
        return docs.map(doc => {
            return { caption: doc.data.caption, image: doc.data.image }
        })
    }
}
