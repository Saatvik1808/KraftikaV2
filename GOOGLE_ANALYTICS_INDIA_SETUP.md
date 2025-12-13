# Google Analytics India Setup Guide

## 🎯 Quick Setup: Create India-Focused Views in Google Analytics

This guide will help you filter and analyze your Google Analytics data specifically for India traffic.

---

## Step 1: Create India-Only View (GA4)

### Option A: Using Filters in GA4 Reports

**1. Create a Custom Report:**
   - Go to **Reports** in your GA4 dashboard
   - Click **Library** (bottom left)
   - Click **Create report**
   - Select **Create detail report**

**2. Configure the Report:**
   - Report Name: "India Traffic Analysis"
   - Click **Add dimension** → Search for "Country" → Select "Country"
   - Add metric: "Active users", "New users", "Engaged sessions"

**3. Add Filter:**
   - In the report settings, click **Add filter**
   - Dimension: **Country**
   - Match type: **Exactly matches**
   - Value: **India**
   - Click **Apply**

**4. Save and Access:**
   - Click **Save**
   - The report will appear in your Library
   - Access it anytime from the Library or Reports section

---

### Option B: Using Comparison Segments (Easier Method)

**1. Create a Comparison:**
   - Go to any report in GA4 (e.g., **User acquisition**)
   - Click **Add comparison** (top right)
   - Click **Create new**

**2. Set Up India Segment:**
   - Name: "India Users"
   - Condition: **Country = India**
   - Click **Apply**
   - Click **Save** (optional, to reuse later)

**3. Use the Comparison:**
   - The comparison is now active
   - All data will be filtered to show only India traffic
   - You can toggle it on/off easily
   - Use this on any report (Users, Traffic acquisition, Engagement, etc.)

---

## Step 2: Set Default Geographic Settings

### Configure Property Settings:

1. **Go to Admin → Property Settings**
   - Click the gear icon (⚙️) bottom left
   - Select **Admin**
   - Under **Property**, click **Property Settings**

2. **Update Settings:**
   - **Default Reporting Time Zone**: Select **(GMT+05:30) India Standard Time**
   - **Default Currency**: Select **Indian Rupee (INR)** if available
   - Click **Save**

---

## Step 3: Create Custom Dashboard for India (Optional)

### Build a Custom Dashboard:

1. **Go to Explore → Free Form**
   - Click **Explore** in left sidebar
   - Click **Blank** or **Free form**

2. **Add Dimensions:**
   - Drag **Country** to Rows
   - Drag **City** to Rows (below Country)
   - Drag **Device category** to Columns

3. **Add Metrics:**
   - Drag **Active users** to Values
   - Drag **Engaged sessions** to Values
   - Drag **Engagement rate** to Values

4. **Add Filter:**
   - Click **Add filter** (top right)
   - Condition: **Country = India**
   - Click **Apply**

5. **Save:**
   - Click **Save** (top right)
   - Name: "India Traffic Dashboard"
   - Click **Save**

---

## Step 4: Monitor Key Metrics for India

### Metrics to Track Weekly:

1. **Traffic Volume:**
   - Active users from India
   - New users from India
   - % of total traffic from India

2. **Top Indian Cities:**
   - Which cities drive most traffic?
   - Focus marketing efforts on top cities

3. **User Behavior:**
   - Pages per session (India vs Global)
   - Average session duration
   - Bounce rate
   - Conversion rate (if ecommerce tracking enabled)

4. **Traffic Sources:**
   - Organic search (Google India)
   - Social media (Instagram, Facebook India)
   - Direct traffic
   - Referrals from Indian websites

---

## Step 5: Set Up Alerts (Optional but Recommended)

### Create Custom Alerts:

1. **Go to Admin → Custom definitions → Custom metrics**
   - This helps track specific India-related events

2. **Create Custom Event (if needed):**
   - Go to **Admin → Events**
   - Track India-specific events (e.g., "india_purchase", "india_newsletter_signup")

---

## Step 6: Export India Data Regularly

### Regular Reports:

**Weekly Export:**
1. Go to your India comparison/segment
2. Click **Export** (top right)
3. Choose format: PDF or Google Sheets
4. Schedule or download

**Monthly Review:**
- Compare month-over-month growth
- Track progress toward goals
- Share with team

---

## 📊 Current vs Target Metrics

### Current Status (Based on Your Analytics):
- **India Users**: 4 (2.82% of total)
- **Rank**: #6 globally
- **Top Traffic**: China (68.31%), Singapore (50.7%), USA (13.38%)

### Target Goals:
- **Month 1**: 50+ India users (20%+ of traffic)
- **Month 3**: 200+ India users (40%+ of traffic)
- **Month 6**: 500+ India users (50%+ of traffic)
- **Target Rank**: #1 traffic source

---

## 🎯 Quick Actions Checklist

### This Week:
- [ ] Create "India Users" comparison segment
- [ ] Set timezone to India Standard Time
- [ ] Create "India Traffic Analysis" report
- [ ] Export baseline data (current India metrics)

### This Month:
- [ ] Create custom dashboard for India
- [ ] Set up weekly India traffic reports
- [ ] Track top 10 Indian cities
- [ ] Monitor conversion rates for India

### Ongoing:
- [ ] Weekly review of India metrics
- [ ] Monthly comparison reports
- [ ] Adjust strategies based on data

---

## 💡 Pro Tips

1. **Use Comparison Segments Daily:**
   - Keep "India Users" segment active while analyzing
   - Compare India metrics vs Global average
   - Identify what's working/not working

2. **Focus on Top Cities:**
   - Create reports for Mumbai, Delhi, Bangalore separately
   - Tailor marketing to top-performing cities
   - Create city-specific landing pages

3. **Track Referrals:**
   - Monitor which Indian websites link to you
   - Identify successful partnerships
   - Build more relationships with similar sites

4. **Monitor Search Terms:**
   - Check "Search terms" report for India
   - See what Indian users search for
   - Optimize content for those terms

5. **Set Up Goals:**
   - Define conversion goals (purchases, signups, etc.)
   - Track India-specific conversion rates
   - Optimize for better conversions

---

## 🔍 Advanced: Custom Dimensions (Optional)

### Track India-Specific Data:

If you want to track more granular India data:

1. **Go to Admin → Custom definitions → Create custom dimension**
   - Name: "Indian City"
   - Scope: Event or User
   - Description: "City in India where user is located"

2. **Implement in Code:**
   - Add custom dimension to your tracking code
   - This requires developer help

**Note**: Basic GA4 setup already tracks country and city, so custom dimensions are optional unless you need very specific data.

---

## 📞 Need Help?

### Common Issues:

**Q: I don't see "Country" dimension in my report**
- Solution: Make sure you're using GA4 (not Universal Analytics)
- Country data should be available by default

**Q: India traffic seems low**
- Check date range (last 28 days vs last year)
- Verify filter is correctly applied
- Check if there are any bot/spam filters excluding traffic

**Q: How do I compare India vs other countries?**
- Create multiple comparisons
- Or use "Country" dimension in a table report
- Sort by "Active users" to see rankings

---

## ✅ Success Checklist

By the end of Week 1, you should have:
- ✅ India-only view/comparison created
- ✅ Timezone set to India Standard Time
- ✅ Baseline metrics documented
- ✅ Weekly tracking system in place

By the end of Month 1, you should see:
- ✅ Increased India traffic (target: 20%+ of total)
- ✅ Understanding of top Indian cities
- ✅ Clear picture of traffic sources
- ✅ Action plan based on data

---

**Remember**: Google Analytics is a powerful tool, but data alone doesn't grow traffic. Use these insights to:
1. Understand your Indian audience
2. Optimize your marketing strategies
3. Focus efforts on what works
4. Adjust tactics based on results

Good luck! 🚀🇮🇳

