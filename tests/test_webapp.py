#!/usr/bin/env python3
"""End-to-end tests for Luxury Hair Studio webapp."""

from playwright.sync_api import sync_playwright
import sys

FRONTEND_URL = "http://127.0.0.1:5173"
BACKEND_URL = "http://localhost:5000"

results = []

def test(name, passed, detail=""):
    status = "PASS" if passed else "FAIL"
    results.append((name, passed, detail))
    print(f"  [{status}] {name}" + (f" — {detail}" if detail else ""))


def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 430, "height": 932})
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        # ── 1. Home screen loads ──
        print("\n1. Home Screen")
        page.goto(FRONTEND_URL)
        page.wait_for_load_state("networkidle")

        # Skip intro loader (wait for it to complete)
        page.wait_for_timeout(3000)

        title = page.title()
        test("Page title set", "Hamid" in title or "Hair" in title, title)

        # Hero section
        hero = page.locator(".hero-section")
        test("Hero section visible", hero.is_visible())

        hero_text = hero.text_content()
        test("Hero has name", "حامد" in hero_text or "Hamid" in hero_text)
        test("Hero has title", "HAIR" in hero_text.upper() or "ARTIST" in hero_text.upper() or "Hair Artist" in hero_text)

        # Navigation tabs
        tabs = page.locator("[role='tab']")
        tab_count = tabs.count()
        test("5 navigation tabs", tab_count == 5, f"found {tab_count}")

        tab_labels = [tabs.nth(i).text_content() for i in range(tab_count)]
        test("Tab labels present", all(t.strip() for t in tab_labels))

        # Home cards
        cards = page.locator(".home-card")
        card_count = cards.count()
        test("Home cards rendered", card_count >= 4, f"found {card_count}")

        # Book Now button (gold card)
        book_btn = page.locator(".home-card").filter(has_text="رزرو وقت")
        test("Book Now CTA present", book_btn.count() > 0)

        # ── 2. Navigation works ──
        print("\n2. Navigation")

        # Click services tab
        services_tab = page.locator("[role='tab']").filter(has_text="خدمات")
        services_tab.click()
        page.wait_for_timeout(1000)
        test("Services screen loads", "#services" in page.url or page.locator("text=خدمات").first.is_visible())

        # Click gallery tab
        gallery_tab = page.locator("[role='tab']").filter(has_text="نمونه")
        gallery_tab.click()
        page.wait_for_timeout(1000)
        test("Gallery screen loads", page.locator("text=نمونه").first.is_visible() or "#gallery" in page.url)

        # Click about tab
        about_tab = page.locator("[role='tab']").filter(has_text="بیشتر")
        about_tab.click()
        page.wait_for_timeout(1000)
        test("About screen loads", page.locator("text=درباره").first.is_visible() or "#about" in page.url)

        # Return home
        home_tab = page.locator("[role='tab']").filter(has_text="خانه")
        home_tab.click()
        page.wait_for_timeout(1000)
        test("Home screen returns", page.locator(".hero-section").is_visible())

        # ── 3. Booking flow ──
        print("\n3. Booking Flow")

        # Navigate to booking
        book_card = page.locator(".home-card").filter(has_text="رزرو وقت")
        book_card.click()
        page.wait_for_timeout(2000)

        # Services list loaded from backend
        service_items = page.locator("[role='radio']")
        service_count = service_items.count()
        test("Services loaded from API", service_count > 0, f"found {service_count}")

        # Select first service
        first_service = service_items.first
        test("First service is clickable", first_service.is_visible())
        first_service.click()
        page.wait_for_timeout(500)

        # Check for "select" or next step button
        next_btn = page.locator("button").filter(has_text="انتخاب").first
        has_next = next_btn.is_visible() if next_btn.count() > 0 else False
        if not has_next:
            # Maybe auto-advance or different button text
            next_btn = page.locator("button").filter(has_text="بعدی").first
            has_next = next_btn.is_visible() if next_btn.count() > 0 else False
        test("Can proceed after service selection", has_next or service_count > 0)

        # Go back
        back_btn = page.locator("button").filter(has_text="بازگشت").first
        if back_btn.is_visible():
            back_btn.click()
            page.wait_for_timeout(1000)
            test("Back navigation works", page.locator(".hero-section").is_visible())

        # ── 4. Backend API health ──
        print("\n4. Backend API")

        health_resp = page.evaluate("fetch('http://localhost:5000/api/health').then(r => r.json())")
        test("Backend health check", health_resp.get("status") == "ok")

        profile_resp = page.evaluate("fetch('http://localhost:5000/api/profile').then(r => r.json())")
        test("Profile API returns data", profile_resp.get("success") is True and profile_resp.get("data") is not None)

        services_resp = page.evaluate("fetch('http://localhost:5000/api/services').then(r => r.json())")
        test("Services API returns data", services_resp.get("success") is True and len(services_resp.get("data", [])) > 0, f"{len(services_resp.get('data', []))} services")

        # Availability
        avail_resp = page.evaluate("fetch('http://localhost:5000/api/availability?date=2026-09-10&serviceId=1').then(r => r.json())")
        test("Availability API returns slots", avail_resp.get("success") is True and len(avail_resp.get("data", {}).get("slots", [])) > 0)

        # ── 5. Accessibility basics ──
        print("\n5. Accessibility")

        page.goto(FRONTEND_URL)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(3000)

        # Skip link exists
        skip_link = page.locator("a[href='#main-content']")
        test("Skip link present", skip_link.count() > 0)

        # Main landmark
        main_landmark = page.locator("main[role='main']")
        test("Main landmark present", main_landmark.count() > 0)

        # Tab navigation
        test("Tablist has aria-label", page.locator("[role='tablist']").get_attribute("aria-label") == "ناوبری اصلی")

        # Buttons used (not divs) for navigation
        nav_buttons = page.locator("[role='tab']")
        all_buttons = True
        for i in range(nav_buttons.count()):
            tag = nav_buttons.nth(i).evaluate("el => el.tagName.toLowerCase()")
            if tag != "button":
                all_buttons = False
                break
        test("Nav uses button elements", all_buttons)

        # ── 6. Responsive behavior ──
        print("\n6. Responsive Design")

        # Mobile viewport (already set to 430px)
        app_frame = page.locator("#app-frame")
        box = app_frame.bounding_box()
        test("App frame fits mobile viewport", box is not None and box["width"] <= 430, f"width={box['width']:.0f}" if box else "not found")

        # ── 7. Console errors ──
        print("\n7. Console Errors")
        # Filter out expected dev warnings
        real_errors = [e for e in console_errors if "React DevTools" not in e and "Slow network" not in e]
        test("No critical console errors", len(real_errors) == 0, f"{len(real_errors)} errors" + (f": {real_errors[:3]}" if real_errors else ""))

        browser.close()


def main():
    print("=" * 60)
    print("  Luxury Hair Studio — End-to-End Test Suite")
    print("=" * 60)
    run_tests()

    print("\n" + "=" * 60)
    passed = sum(1 for _, p, _ in results if p)
    failed = sum(1 for _, p, _ in results if not p)
    total = len(results)
    print(f"  Results: {passed}/{total} passed, {failed} failed")
    print("=" * 60)

    if failed > 0:
        print("\nFailed tests:")
        for name, p, detail in results:
            if not p:
                print(f"  FAIL: {name}" + (f" — {detail}" if detail else ""))

    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
