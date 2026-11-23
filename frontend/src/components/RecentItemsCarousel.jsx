import { useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { apiBaseUrl } from '../config/api.js'
import './RecentItemsCarousel.css'

function LocationPinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CalendarMiniIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function CategoryIllustration({ category, name = '' }) {
  const common = {
    'aria-hidden': true,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  const lowerName = (name || '').toLowerCase()
  const lowerCat = (category || '').toLowerCase()

  if (lowerCat.includes('card') || lowerCat.includes('wallet')) {
    return (
      <svg {...common}>
        <rect x="8" y="12" width="32" height="25" rx="4" />
        <path d="M8 19h32M31 27h.1M13 12V9h22v3" />
      </svg>
    )
  }

  if (lowerCat.includes('electronic') || lowerName.includes('charger') || lowerName.includes('phone') || lowerName.includes('bud')) {
    return (
      <svg {...common}>
        <rect x="12" y="14" width="21" height="19" rx="4" />
        <path d="M18 14V9m9 5V9M18 25h9M22 21l-3 4h4l-2 4" />
        <path d="M33 24h4a4 4 0 0 1 4 4v5" />
      </svg>
    )
  }

  if (lowerCat.includes('bag')) {
    return (
      <svg {...common}>
        <path d="M12 18h24l3 21H9l3-21Z" />
        <path d="M18 18v-4a6 6 0 0 1 12 0v4M18 25v.1M30 25v.1" />
      </svg>
    )
  }

  if (lowerCat.includes('key')) {
    return (
      <svg {...common}>
        <circle cx="17" cy="20" r="7" />
        <path d="m22 25 13 13m-5-5 4-4m-8 0 4-4" />
        <circle cx="17" cy="20" r="2" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M24 7v34M10 15l28 18M38 15 10 33" />
      <circle cx="24" cy="24" r="17" />
    </svg>
  )
}

function formatItemDate(dateStr) {
  if (!dateStr) return ''
  try {
    const isIsoDate = /^\d{4}-\d{2}-\d{2}/.test(dateStr)
    const dateObj = isIsoDate ? new Date(dateStr.length === 10 ? `${dateStr}T00:00:00Z` : dateStr) : new Date(dateStr)
    if (isNaN(dateObj.getTime())) return dateStr
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(dateObj)
  } catch {
    return dateStr
  }
}

export default function RecentItemsCarousel({ onNavigate }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const sliderRef = useRef(null)

  useEffect(() => {
    let isCurrent = true

    const fetchRecentItems = async () => {
      setLoading(true)
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('items')
            .select(
              'id, name, status, category, custom_category, description, location, reported, photo_url, is_dismissed, is_resolved, created_at',
            )
            .neq('is_dismissed', true)
            .order('created_at', { ascending: false })
            .limit(16)

          if (error) throw error

          if (isCurrent && data) {
            const active = data
              .filter((it) => !it.is_dismissed && !it.is_resolved)
              .slice(0, 10)
              .map((it) => ({
                ...it,
                customCategory: it.custom_category || it.customCategory,
              }))
            setItems(active)
          }
          return
        }

        // Fallback to local API
        const response = await fetch(`${apiBaseUrl}/api/items`)
        if (response.ok) {
          const payload = await response.json()
          if (isCurrent && payload?.items) {
            const active = payload.items
              .filter((it) => !it.is_dismissed && !it.is_resolved)
              .slice(0, 10)
            setItems(active)
          }
        }
      } catch (err) {
        console.warn('Could not load recent items for carousel:', err)
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    fetchRecentItems()

    return () => {
      isCurrent = false
    }
  }, [])

  // Auto-slide effect with continuous smooth scroll and loop
  useEffect(() => {
    if (items.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      const container = sliderRef.current
      if (!container) return

      const card = container.querySelector('.recent-carousel-card')
      const cardWidth = card ? card.offsetWidth + 18 : 290
      const maxScrollLeft = container.scrollWidth - container.clientWidth

      // Loop back to start smoothly if we reached the right edge
      if (container.scrollLeft >= maxScrollLeft - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        container.scrollBy({ left: cardWidth, behavior: 'smooth' })
      }
    }, 3200)

    return () => clearInterval(interval)
  }, [items.length, isPaused])

  const handleScrollPrev = () => {
    const container = sliderRef.current
    if (!container) return
    const card = container.querySelector('.recent-carousel-card')
    const cardWidth = card ? card.offsetWidth + 18 : 290
    const step = cardWidth * (window.innerWidth < 640 ? 1 : 2)

    if (container.scrollLeft <= 15) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: -step, behavior: 'smooth' })
    }
  }

  const handleScrollNext = () => {
    const container = sliderRef.current
    if (!container) return
    const card = container.querySelector('.recent-carousel-card')
    const cardWidth = card ? card.offsetWidth + 18 : 290
    const step = cardWidth * (window.innerWidth < 640 ? 1 : 2)
    const maxScrollLeft = container.scrollWidth - container.clientWidth

    if (container.scrollLeft >= maxScrollLeft - 15) {
      container.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: step, behavior: 'smooth' })
    }
  }

  const handleItemClick = (itemId) => {
    if (onNavigate) {
      onNavigate(`/browse?item=${encodeURIComponent(itemId)}`)
    }
  }

  return (
    <section
      className="recent-items-section section-block"
      id="recent-items"
      aria-labelledby="recent-items-heading"
    >
      <div className="section-heading recent-heading-wrap">
        <div>
          <p className="eyebrow recent-eyebrow">
            <span className="live-pulse-dot" aria-hidden="true" />
            Live Campus Feed
          </p>
          <h2 id="recent-items-heading">Recently Reported Items</h2>
          <p className="section-intro">
            Latest belongings reported lost or found by students across campus.
          </p>
        </div>

        <div className="recent-header-actions">
          <button
            type="button"
            className="text-link view-all-link"
            onClick={(e) => {
              e.preventDefault()
              if (onNavigate) onNavigate('/browse')
            }}
          >
            View All Items
            <ChevronRightIcon />
          </button>

          <div className="carousel-nav-arrows">
            <button
              type="button"
              className="carousel-arrow-btn"
              onClick={handleScrollPrev}
              aria-label="Scroll left"
              title="Previous items"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="carousel-arrow-btn"
              onClick={handleScrollNext}
              aria-label="Scroll right"
              title="Next items"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className="recent-carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsPaused(false), 2000)
        }}
      >
        <div className="recent-carousel-track" ref={sliderRef}>
          {loading ? (
            // Skeleton Shimmer Loading State
            Array.from({ length: 4 }).map((_, idx) => (
              <div className="recent-carousel-card recent-card-skeleton" key={idx}>
                <div className="skeleton-media" />
                <div className="skeleton-body">
                  <div className="skeleton-line skeleton-tag" />
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-meta" />
                  <div className="skeleton-line skeleton-btn" />
                </div>
              </div>
            ))
          ) : items.length > 0 ? (
            items.map((item) => {
              const isLost = (item.status || '').toLowerCase() === 'lost'
              const formattedDate = formatItemDate(item.reported)

              return (
                <article
                  className="recent-carousel-card"
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleItemClick(item.id)
                    }
                  }}
                  aria-label={`View details for ${item.name}, ${item.status}`}
                >
                  <div className="recent-card-media">
                    {item.photo_url ? (
                      <img
                        src={item.photo_url}
                        alt={item.name}
                        className="recent-card-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="recent-card-placeholder">
                        <div className="recent-placeholder-icon">
                          <CategoryIllustration
                            category={item.category}
                            name={item.name}
                          />
                        </div>
                        <span className="recent-placeholder-caption">No photo</span>
                      </div>
                    )}

                    {/* Status Badge & Date Chip Overlay */}
                    <div className="recent-card-overlay-top">
                      <span
                        className={`recent-status-badge ${
                          isLost ? 'recent-status-lost' : 'recent-status-found'
                        }`}
                      >
                        <span className="recent-status-dot" aria-hidden="true" />
                        {isLost ? 'LOST' : 'FOUND'}
                      </span>
                      {formattedDate && (
                        <span className="recent-date-chip">
                          <CalendarMiniIcon />
                          {formattedDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="recent-card-body">
                    <div className="recent-card-tag-row">
                      <span className="recent-category-tag">
                        {item.customCategory
                          ? `Other (${item.customCategory})`
                          : item.category}
                      </span>
                    </div>

                    <h3 className="recent-card-title" title={item.name}>
                      {item.name}
                    </h3>

                    <div className="recent-card-location" title={`Location: ${item.location || 'Campus'}`}>
                      <LocationPinIcon />
                      <span>{item.location || 'Campus'}</span>
                    </div>

                    <div className="recent-card-footer">
                      <span className="recent-view-btn">
                        View Details
                        <ChevronRightIcon />
                      </span>
                    </div>
                  </div>
                </article>
              )
            })
          ) : (
            <div className="recent-carousel-empty">
              <p>No recent items reported yet.</p>
              <button
                type="button"
                className="button button-dark"
                onClick={() => {
                  if (onNavigate) onNavigate('/report')
                }}
              >
                Report an Item
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
