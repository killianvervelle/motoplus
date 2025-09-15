import Expandable from '@/components/Expandable'
import ImageFallback from '@/helpers/ImageFallback'
import { markdownify } from '@/lib/utils/textConverter'
import PageHeader from '@/partials/PageHeader'
import SeoMeta from '@/partials/SeoMeta'
import Testimonials from '@/partials/Testimonials'
import { AboutUsItem, Faq, Testimonial } from '@/types'
import Link from 'next/link'
import { FaBoxOpen, FaTools } from 'react-icons/fa'
import { IoDiamondSharp } from "react-icons/io5";
import { RiCustomerService2Fill } from "react-icons/ri"
import { translateServer } from "../../../lib/utils/translateServer";
import matter from 'gray-matter';

const About = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/content/about/_index.md`);
  const text = await res.text();
  const { data: frontmatter } = matter(text);

  const {
    button,
    testimonials_section_enable,
  } = frontmatter

  const aboutUsSlugs = {
    translatedTitle: "title",
    translatedFaqTitle: "faq-section-title",
    translatedFaqSubTitle: "faq-section-subtitle",
    translatedTestimonialTitle: "testimonials-section-title",
    translatedValueTitle: "reasons",
    translatedMissionTitle: "direct",
    translatedVisionTitle: "third-party",
    translatedTeamFastSecure: "fast-secure",
    translatedTeamQuality: "quality",
    translatedTeamInspected: "inspected",
    translatedCtaTitle: "delivery",
    translatedCustomer: "customer",
    translatedSupport: "support"
  };

  const translations = await Promise.all(
    Object.entries(aboutUsSlugs).map(([key, slug]) =>
      translateServer("about-us", slug).then((value) => [key, value])
    )
  );

  const translated = Object.fromEntries(translations) as Record<
    keyof typeof aboutUsSlugs,
    string
  >;

  const translatedAboutUs = await Promise.all(
    frontmatter.about_us.map(async (item: AboutUsItem) => {
      const title = await translateServer("about-us", item.slug_title)
      const content = await translateServer("about-us", item.slug_content)
      const image = await translateServer("about-us", item.image)
      return { title, content, image }
    })
  )

  const translatedFaqs = await Promise.all(
    frontmatter.faqs.map(async (item: Faq) => {
      const title = await translateServer("about-us", item.slug_title)
      const content = await translateServer("about-us", item.slug_content)
      return { title, content }
    })
  )

  const translatedButton = {
    label: await translateServer("about-us", button.slug_label),
    link: await translateServer("about-us", button.slug_link)
  }

  const translatedTestimonials = await Promise.all(
    frontmatter.testimonials.map(
      async (item: Testimonial) => {
        const name = await translateServer("about-us", item.slug_name)
        const designation = await translateServer("about-us", item.slug_designation)
        const content = await translateServer("about-us", item.slug_content)
        const image = await translateServer("about-us", item.avatar)
        return { name, designation, content, image }
      }
    )
  )

  return (
    <>
      <SeoMeta {...frontmatter} />

      <PageHeader title={translated.translatedTitle} />

      <section className='section'>
        <div className='container'>
          {translatedAboutUs?.map((section: { title: string; content: string; image: string }, index: number) => (
            <div className={`lg:flex gap-8 lg:mt-9`} key={section?.title}>
              {index % 2 === 0 ? (
                <>
                  <div className='hidden lg:flex lg:mx-auto w-full'>
                    <ImageFallback
                      className='lg:rounded-md'
                      src={"/images/aboutUs.jpg"}
                      width={536}
                      height={449}
                      alt={section?.title}
                    />
                  </div>
                  <div className='lg:mt-0 row lg:block text-center lg:text-start'>
                    <h3>{section?.title}</h3>
                    {section?.content
                      .split(/\n\n+/)
                      .map((para, i) => (
                        <p
                          key={i}
                          className="mt-8 text-text-light dark:text-darkmode-text-light leading-7 text-justify"
                          dangerouslySetInnerHTML={markdownify(para)}
                        />
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3>{section.title}</h3>
                    <p
                      className='mt-4 text-text-light dark:text-darkmode-text-light leading-7'
                      dangerouslySetInnerHTML={markdownify(section.content)}
                    />
                  </div>
                  <ImageFallback
                    className='rounded-md mx-auto mt-10 lg:mt-0'
                    src={section.image}
                    width={536}
                    height={449}
                    alt={section.title}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {testimonials_section_enable && <Testimonials title={translated.translatedTestimonialTitle!} testimonials={translatedTestimonials!} />}

      <section className='section'>
        <div className='container'>
          <div className='px-7 dark:bg-darkmode-light text-center rounded-md '>
            <h3>{translated.translatedValueTitle}</h3>
            <div className='bg-[#e9e9e9] dark:bg-darkmode-light row justify-center py-20 mt-14'>
              <div className='col-6 md:col-5 lg:col-3 my-12 lg:my-0'>
                <div className='flex justify-center'>
                  <FaTools size={48} />
                </div>
                <h5 className='md:h-20 lg:h-24 mt-6 pb-6 md:pb-0'>{translated.translatedMissionTitle}</h5>
                <p className="mx-5">{translated.translatedVisionTitle}</p>
              </div>

              <div className='col-6 md:col-5 lg:col-3 my-12 lg:my-0'>
                <div className='flex justify-center'>
                  <FaBoxOpen size={48} />
                </div>
                <h5 className='md:h-20 lg:h-24 mt-6 pb-6 md:pb-0'>{translated.translatedTeamFastSecure}</h5>
                <p className="mx-5">{translated.translatedCtaTitle}</p>
              </div>

              <div className='col-6 md:col-5 lg:col-3 my-12 lg:my-0'>
                <div className='flex justify-center'>
                  <IoDiamondSharp size={48} />
                </div>
                <h5 className='md:h-20 lg:h-24 mt-6 pb-6 md:pb-0'>{translated.translatedTeamQuality}</h5>
                <p className="mx-5">{translated.translatedTeamInspected}</p>
              </div>

              <div className='col-6 md:col-5 lg:col-3 my-12 lg:my-0'>
                <div className='flex justify-center'>
                  <RiCustomerService2Fill size={48} />
                </div>
                <h5 className='md:h-20 lg:h-24 mt-6 pb-6 md:pb-0'>{translated.translatedCustomer}</h5>
                <p className="mx-5">{translated.translatedSupport}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='section-bottom'>
        <div className='container'>
          <div className='bg-[#e9e9e9] px-7 lg:px-32 pt-20 dark:bg-darkmode-light mb-14 xl:mb-28 rounded-b-md'>
            <div className='row'>
              <div className='md:col-5 mx-auto space-y-5 mb-10 md:mb-0'>
                <h3 dangerouslySetInnerHTML={markdownify(translated.translatedFaqTitle)} />
                <p dangerouslySetInnerHTML={markdownify(translated.translatedFaqSubTitle)} className='md:text-lg text-justify pr-5' />

                {button?.enable && (
                  <Link className='btn btn-sm md:btn-lg btn-primary font-medium hover:bg-gray-700' href={translatedButton.link}>
                    {translatedButton.label}
                  </Link>
                )}
              </div>

              <div className='md:col-7 text-justify pb-10'>
                <Expandable faqs={translatedFaqs!} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
