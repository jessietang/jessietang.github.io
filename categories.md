---
layout: default
title: 文章分类
---

<div class="categories-page">
    <h2>文章分类</h2>
    
    {% capture categories %}
        {% for category in site.categories %}
            {{ category[0] }}
        {% endfor %}
    {% endcapture %}
    {% assign sorted_categories = categories | split: ' ' | sort %}
    
    <ul class="category-list">
        {% for category in sorted_categories %}
        <li class="category-item">
            <h3><a href="#{{ category | slugify }}">{{ category }}</a></h3>
            <ul>
                {% for post in site.categories[category] %}
                <li>
                    <a href="{{ post.url }}">{{ post.title }}</a>
                    <span class="post-date">{{ post.date | date: "%Y年%m月%d日" }}</span>
                </li>
                {% endfor %}
            </ul>
        </li>
        {% endfor %}
    </ul>
</div>