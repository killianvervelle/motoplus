export type RegularPage = {
  frontmatter: {
    title?: string
    meta_title?: string
    description?: string
    image?: string
    main_slug_title: string
    about_us: AboutUsItem[]
    contact_meta?: ContactUsItem[]
    button: Button
    slug_faq_section_title: string
    faqs: Faq[]
    testimonials_section_enable: boolean
    slug_faq_section_subtitle: string
    testimonials: Testimonial[]
    staff_section_enable?: boolean
    slug_testimonials_section_title: string
    staff?: {
      name: string
      designation: string
      avatar: string
    }[]
  }
}

export type AboutUsItem = {
  image: string
  slug_content: string
  slug_title: string
}

export type ContactUsItem = {
  name: string
  contact: string
  slug: sting
}

export type Faq = {
  slug_title: string
  slug_content: string
}

export type TranslatedFaq = {
  title: string
  content: string
}

export type Post = {
  frontmatter: {
    title: string
    meta_title?: string
    description?: string
    image?: string
    categories: string[]
    author: string
    tags: string[]
    date?: string
    draft?: boolean
  }
  slug?: string
  content?: string
}

export type Author = {
  frontmatter: {
    title: string
    image?: string
    description?: string
    meta_title?: string
    social: [
      {
        name: string
        icon: string
        link: string
      }
    ]
  }
  content?: string
  slug?: string
}

export type Feature = {
  button: button
  image: string
  bulletpoints: string[]
  content: string
  title: string
}

export type Button = {
  enable: boolean
  slug_label: string
  slug_link: string
}

export type Testimonial = {
  slug_name: string
  slug_designation: string
  slug_content:string
  avatar: string
}

type TestimonialsProps = {
  title: string
  testimonials: TranslatedTestimonial[]
}

export type TranslatedTestimonial = {
  name: string
  designation: string
  content: string
  image: string
}

export type Banner = {
  title: string
  image: string
  content?: string
  button?: Button
}

export type Call_to_action = {
  enable?: boolean
  title: string
  sub_title: string
  description: string
  image: string
  button: Button
}

export type contact_meta = {
  frontmatter: {
    heading: string
    subHeading: string
    subtitle?: string
  }
  content?: string
  slug?: string
}

export type Categories = {
  id: number
  name: string
  imageSrc: string
  itemCount: number
}

export type ImageNode = {
  url: string;
  altText: string | null;
};

export type ImageEdge = { node: ImageNode };

export type ImageConnection = { edges: ImageEdge[] };
