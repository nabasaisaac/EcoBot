from simple_image_download import simple_image_download

response = simple_image_download.simple_image_download()

keywords = [
    "dirty plastic bottles",
    "rubbish bottles",
    "polluted water bottles",
    "trash bottles"
]

for kw in keywords:
    response.download(kw, limit=300)
