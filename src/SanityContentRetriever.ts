import sanityClient from '@sanity/client'
import { SanityClient } from '@sanity/client'

interface ImageData {
    url: string
    metadata: any
}

export interface Image {
    alt: string,
    caption: string,
    image: ImageData
}

export default class SanityContentRetriever {
    client: SanityClient

    constructor() {
        this.client = sanityClient({
            projectId: "2hbw1kk9",
            dataset: "content",
            apiVersion: "2022-01-18",
            useCdn: true
        })
    }

    async getImages(): Promise<Image[]> {
        const query = "*[_type == 'galleryImage'] | order(_createdAt) { 'image': src.asset->{url,metadata}, caption, alt }"
        return await this.client.fetch<Image[]>(query)
    }
}
