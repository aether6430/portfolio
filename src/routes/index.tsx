import { createFileRoute, Link } from '@tanstack/react-router'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Calendar, Github, Twitter, Maximize2, Moon, Sun } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { AnimatedQuote, MotionSection, RevealWords, StaggerGroup, StaggerItem } from '../components/portfolio-motion'
import { smoothEase } from '../components/motion-utils'
import { heroCopy, profile, projects, skillGroups, socialLinks, type Project } from '../content/portfolio'
import { ThemeContext } from '../context/theme'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const blogCardClass = 'group flex flex-col gap-2 p-4 -mx-4 rounded-xl hover:bg-app-surface-hover transition-colors interact-hover'
  const blogTagClass = 'pill px-2 py-0.5 text-[10px]'

  type BlogFrontmatter = { title?: string, date?: string, tags?: string[] }
  const mdxModules = import.meta.glob('../content/blog/*.mdx', { eager: true }) as Record<string, { frontmatter?: BlogFrontmatter }>
  const recentBlogs = Object.entries(mdxModules)
    .map(([path, module]) => {
      const slug = path.split('/').pop()?.replace('.mdx', '') || ''
      const frontmatter = module.frontmatter || {}
      return { slug, ...frontmatter }
    })
    .slice(0, 3)

  useEffect(() => {
    if (!selectedProject) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedProject])

  return (
    <main className="flex flex-col text-sm leading-relaxed">
      <div className="w-full h-32 md:h-48 dot-bg shrink-0" />

      <MotionSection className="flex flex-col">
        <div className="dashed-h" />
        <div className="flex flex-col gap-8 py-8">
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 1 },
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
            }}
          >
            <motion.div className="flex items-end gap-5 md:gap-8" variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: smoothEase } } }}>
              <img
                src={profile.image}
                alt="Profile"
                className="w-28 h-28 md:w-30 md:h-30 rounded-xl object-cover object-center border border-app-border shadow-app-image"
              />
              <div className="pb-1">
                <motion.h1
                  className="font-mono text-[clamp(2.4rem,5.2vw,3.8rem)] leading-[0.95] tracking-[-0.06em] text-app-heading"
                  variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: smoothEase } } }}
                >
                  {profile.name}
                </motion.h1>
                <motion.p
                  className="mt-2 text-app-text-muted tracking-[0.12em] uppercase text-[0.7rem]"
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: smoothEase } } }}
                >
                  {profile.role}
                </motion.p>
              </div>
            </motion.div>
            <motion.div className="flex items-center gap-4" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: smoothEase } } }}>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-app-surface-2 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </motion.div>
          </motion.div>

          <div className="dashed-h" />

          <motion.div
            className="flex flex-col gap-4 max-w-xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 1 },
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.26 } },
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: smoothEase } } }}>
              <RevealWords text={heroCopy.intro} />
            </motion.div>
            <motion.p variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: smoothEase } } }}>
              {heroCopy.body1}
            </motion.p>
            <motion.p variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: smoothEase } } }}>
              {heroCopy.body2}
            </motion.p>
            <motion.a
              href={heroCopy.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.22em] text-app-text-muted hover:text-app-heading transition-colors"
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: smoothEase } } }}
            >
              {heroCopy.liveLabel} <span aria-hidden="true">↗</span>
            </motion.a>
          </motion.div>

          <motion.div
            className="pb-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 1 },
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.42 } },
            }}
          >
            <motion.h2 className="text-sm font-semibold mb-3" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: smoothEase } } }}>
              Here are my socials
            </motion.h2>
            <motion.div className="flex flex-wrap items-center gap-2" variants={{ hidden: { opacity: 1 }, visible: { transition: { staggerChildren: 0.08 } } }}>
              {socialLinks.map((link) => (
                <StaggerItem key={link.href}>
                  <a href={link.href} className="pill">
                    {link.label === 'Github' ? <Github className="w-3.5 h-3.5" /> : <Twitter className="w-3.5 h-3.5" />} {link.label}
                  </a>
                </StaggerItem>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </MotionSection>

      <MotionSection className="flex flex-col pt-6">
        <div className="dashed-h" />
        <h2 className="text-xl font-bold py-6">Projects</h2>
        <div className="dashed-h" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} onDetailsClick={() => setSelectedProject(project)} />
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <a href="#" className="btn-secondary rounded-full">View all ↗</a>
        </div>
      </MotionSection>

      <MotionSection className="flex flex-col pt-12">
        <div className="dashed-h" />
        <h2 className="text-xl font-bold py-6">Skills & Technology</h2>
        <div className="dashed-h" />
        <StaggerGroup className="flex flex-col gap-4 pt-6">
          {Object.entries(skillGroups).map(([group, skills]) => (
            <TickerRow key={group} label={group} skills={skills} reverse={group === 'Backend'} />
          ))}
        </StaggerGroup>
      </MotionSection>

      <MotionSection className="flex flex-col pt-12">
        <div className="dashed-h" />
        <h2 className="text-xl font-bold py-6">Blogs</h2>
        <div className="dashed-h" />
        <StaggerGroup className="flex flex-col gap-4 pt-6">
          {recentBlogs.map((blog) => (
            <StaggerItem key={blog.slug}>
              <Link key={blog.slug} to="/blog/$slug" params={{ slug: blog.slug }} className={blogCardClass}>
                <h3 className="text-base font-semibold group-hover:underline line-clamp-2">{blog.title || blog.slug}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-app-text-subtle">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {blog.date || 'Recent'}
                  </span>
                  <div className="flex items-center gap-2">
                    {(blog.tags || []).map((tag: string) => (
                      <span key={tag} className={blogTagClass}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </MotionSection>

      <motion.footer
        className="pt-24 pb-24 text-center flex flex-col items-center justify-center text-app-text-muted gap-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: smoothEase }}
        viewport={{ once: true, amount: 0.45 }}
      >
        <AnimatedQuote
          quote="Doubt is a fog of your own making; the path becomes clear the moment you take the first step."
          author="Abhiram Damodara"
        />
      </motion.footer>

      <div className="w-full h-32 md:h-48 dot-bg shrink-0" />

      <AnimatePresence>
        {selectedProject ? (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        ) : null}
      </AnimatePresence>
    </main>
  )
}

function TickerRow({ label, skills, reverse }: { label: string, skills: string[], reverse?: boolean }) {
  const tickerItems = [...skills, ...skills]

  return (
    <StaggerItem>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h3 className="text-[10px] uppercase tracking-[0.28em] text-app-text-subtle">{label}</h3>
          <span className="h-px flex-1 bg-app-border" />
        </div>
        <div className="ticker-track py-1">
          <div className={`ticker-row ${reverse ? 'ticker-row-reverse' : ''}`}>
            {tickerItems.map((skill, index) => (
              <span key={`${skill}-${index}`} className="text-sm whitespace-nowrap tracking-tight text-app-text-muted">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </StaggerItem>
  )
}

function ProjectCard({ project, onDetailsClick }: { project: Project, onDetailsClick: () => void }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      className="group flex h-full flex-col gap-3 rounded-2xl border border-transparent bg-transparent p-0"
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: smoothEase }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-app-border/80 bg-transparent">
        <motion.div className="project-preview-glow absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          transition={{ duration: 0.4, ease: smoothEase }}
        />
      </div>
      <div className="flex h-full flex-col gap-2">
                <h3 className="font-bold text-base text-app-heading">{project.title}</h3>
                <p
          className="text-app-text-muted text-sm leading-relaxed"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
          }}
        >
          {project.summary}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {project.tags.map((tag) => (
            <span key={tag} className="text-[10px] uppercase tracking-[0.18em] text-app-text-subtle">
              {tag}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={onDetailsClick}
          className="text-xs text-app-text-muted flex items-center gap-1 hover:text-app-accent-soft transition-colors self-start mt-1"
        >
          View details <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </motion.article>
  )
}

function ProjectModal({ project, onClose }: { project: Project, onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="Close project modal"
        className="absolute inset-0 bg-app-modal-backdrop"
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-6xl max-h-[88vh] overflow-hidden rounded-lg bg-app-bg shadow-2xl project-modal-surface"
        initial={{ y: 20, scale: 0.985, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 16, scale: 0.985, opacity: 0 }}
        transition={{ duration: 0.28, ease: smoothEase }}
      >
        <div className="grid max-h-[88vh] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex max-h-[88vh] flex-col gap-4 overflow-y-auto p-6 sm:p-8 lg:p-8">
            {project.liveUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-app-surface-2 project-modal-item">
                  <iframe
                    src={project.liveUrl}
                    title={`${project.title} preview`}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                  />
                </div>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.22em] text-app-text-muted hover:text-app-heading transition-colors"
                >
                  Open preview <span aria-hidden="true">↗</span>
                </a>
              </div>
            ) : (
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-app-surface-2 project-modal-item">
                <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-app-bg/55 via-app-bg/10 to-transparent" />
              </div>
            )}
          </div>

          <div className="flex max-h-[88vh] flex-col gap-6 overflow-y-auto p-6 sm:p-8 lg:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-app-text-subtle">Selected project</p>
                <h3 className="mt-3 text-3xl font-bold tracking-tight text-app-heading">{project.title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-app-modal-border bg-app-surface-2 px-3 py-2 text-xs text-app-text-muted transition-colors hover:bg-app-surface-hover hover:text-app-heading"
              >
                Close
              </button>
            </div>

            <p className="text-sm leading-7 text-app-text-muted">
              {project.summary}
            </p>

            <ol className="list-decimal space-y-3 border-t border-app-border pl-5 pt-5 text-sm leading-6 text-app-text-muted marker:text-app-accent-soft">
              {project.details.map((item) => (
                <li key={item} className="pl-2">
                  <span>{item}</span>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap gap-2 border-t border-app-border pt-5">
              {project.tags.map((tag) => (
                <span key={tag} className="pill rounded-full border border-app-accent-soft/25 bg-app-surface-2 text-app-accent-soft">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
