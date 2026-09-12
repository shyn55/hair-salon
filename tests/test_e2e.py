#!/usr/bin/env python3
"""End-to-end tests for Luxury Hair Studio using system Chrome."""

from playwright.sync_api import sync_playwright
import sys

FRONTEND_URL = "http://localhost:5173"
BACKEND_URL = "http://localhost:5000"

results = []

def test(name, passed, detail=""):
    status = "PASS" if passed else "FAIL"
    results.append((name, passed, detail))
    try:
        print(f"  [{status}] {name}" + (f" -- {detail}" if detail else ""))
    except UnicodeEncodeError:
        safe = detail.encode('ascii', 'replace').decode('ascii') if detail else ''
        print(f"  [{status}] {name}" + (f" -- {safe}" if safe else ""))


def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            channel="chrome",  # Use system Chrome
        )
        page = browser.new_page(viewport={"width": 430, "height": 932})
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        # -- 1. Home screen loads --
        print("\n1. Home Screen")
        page.goto(FRONTEND_URL, timeout=60000)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(3000)

        title = page.title()
        test("Page title set", "Hamid" in title or "Hair" in title, title)

        hero = page.locator(".hero-section")
        test("Hero section visible", hero.is_visible())

        hero_text = hero.text_content()
        test("Hero has name or studio title", len(hero_text.strip()) > 5, f"{len(hero_text.strip())} chars")
        test("Hero has subtitle", "Men" in hero_text or "Women" in hero_text)

        tabs = page.locator("[role='tab']")
        tab_count = tabs.count()
        test("5 navigation tabs", tab_count == 5, f"found {tab_count}")

        cards = page.locator(".home-card")
        card_count = cards.count()
        test("Home cards rendered (>=4)", card_count >= 4, f"found {card_count}")

        book_btn = page.locator(".home-card").filter(has_text="رزرو وقت")
        test("Book Now CTA present", book_btn.count() > 0)

        # -- 2. Navigation --
        print("\n2. Navigation")

        services_tab = page.locator("[role='tab']").filter(has_text="خدمات")
        services_tab.click()
        page.wait_for_timeout(1500)
        test("Services tab navigates", page.url.find("services") >= 0 or page.locator("text=خدمات").first.is_visible())

        home_tab = page.locator("[role='tab']").filter(has_text="خانه")
        home_tab.click()
        page.wait_for_timeout(1000)
        test("Back to home", page.locator(".hero-section").is_visible())

        # -- 3. Booking flow --
        print("\n3. Booking Flow")

        book_card = page.locator(".home-card").filter(has_text="رزرو وقت")
        book_card.click()
        page.wait_for_timeout(2000)

        service_items = page.locator("[role='radio']")
        service_count = service_items.count()
        test("Services loaded from API", service_count > 0, f"found {service_count}")

        # Select first service
        first_service = service_items.first
        first_service.click()
        page.wait_for_timeout(1000)

        # After clicking, page advances to date selector
        # The radio buttons are replaced by the date grid
        page.wait_for_timeout(1500)
        has_date_ui = page.locator("text=انتخاب تاریخ").count() > 0 or page.locator("text=تاریخ").count() > 0
        service_count_after = page.locator("[role='radio']").count()
        navigated = service_count_after < service_count  # Fewer radios = we moved forward
        test("Service selection advances flow", navigated or has_date_ui, f"radios_before={service_count}, after={service_count_after}")

        # -- 4. Backend API --
        print("\n4. Backend API")

        health = page.evaluate("fetch('http://localhost:5000/api/health').then(r => r.json())")
        test("Health endpoint", health.get("status") == "ok")

        profile = page.evaluate("fetch('http://localhost:5000/api/profile').then(r => r.json())")
        test("Profile endpoint", profile.get("success") is True)

        services_api = page.evaluate("fetch('http://localhost:5000/api/services').then(r => r.json())")
        svc_count = len(services_api.get("data", []))
        test("Services endpoint", services_api.get("success") is True and svc_count > 0, f"{svc_count} services")

        avail = page.evaluate("fetch('http://localhost:5000/api/customer/availability?date=2026-09-10&serviceId=svc-1').then(r => r.json())")
        slots = avail.get("data", {}).get("slots", [])
        test("Availability endpoint", avail.get("success") is True and len(slots) > 0, f"{len(slots)} slots")

        # -- 5. Accessibility --
        print("\n5. Accessibility")

        page.goto(FRONTEND_URL, timeout=60000)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(3000)

        skip_link = page.locator("a[href='#main-content']")
        test("Skip link present", skip_link.count() > 0)

        main_landmark = page.locator("main[role='main']")
        test("Main landmark", main_landmark.count() > 0)

        tablist_label = page.locator("[role='tablist']").get_attribute("aria-label")
        test("Tablist has aria-label", tablist_label == "ناوبری اصلی")

        # Buttons for navigation
        all_buttons = True
        for i in range(page.locator("[role='tab']").count()):
            tag = page.locator("[role='tab']").nth(i).evaluate("el => el.tagName.toLowerCase()")
            if tag != "button":
                all_buttons = False
                break
        test("Nav uses button elements", all_buttons)

        # -- 6. Responsive --
        print("\n6. Responsive")

        frame = page.locator("#app-frame")
        box = frame.bounding_box()
        test("App frame fits viewport", box is not None and box["width"] <= 430, f"width={box['width']:.0f}" if box else "N/A")

        # -- 7. Errors --
        print("\n7. Console Errors")
        real_errors = [e for e in console_errors if "React DevTools" not in e and "Slow network" not in e and "Download the React" not in e and "ERR_CONNECTION_CLOSED" not in e and "404" not in e and "ERR_TIMED_OUT" not in e]
        test("No critical console errors", len(real_errors) == 0, f"{len(real_errors)}: {real_errors[:2]}" if real_errors else "")

        browser.close()


def main():
    print("=" * 60)
    print("  Luxury Hair Studio -- E2E Test Suite")
    print("=" * 60)
    run_tests()

    print("\n" + "=" * 60)
    passed = sum(1 for _, p, _ in results if p)
    failed = sum(1 for _, p, _ in results if not p)
    total = len(results)
    print(f"  Results: {passed}/{total} passed, {failed} failed")
    print("=" * 60)

    if failed:
        print("\nFailed:")
        for name, p, detail in results:
            if not p:
                print(f"  - {name}" + (f" ({detail})" if detail else ""))

    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
