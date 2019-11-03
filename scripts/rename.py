import os,glob,csv,json

crsid = []
with open('freshers.csv', mode='r', encoding='utf-8-sig') as csvfile:
    dict = csv.DictReader(csvfile)
    for x in dict:
        temp = json.loads(json.dumps(x))
        newdict = {}
        for key in temp.keys():
            newdict[key.lower()] = temp[key]
        newdict['name'] = newdict['name'].strip()
        avoid = ['jb2222','ru225']
        #Now there are only 151 images to do
        if newdict['username'] in avoid:
            continue
        else:
            crsid.append(newdict)

# Note that the freshers csv list is ALREADY in alphabetical order, but we sort it again to be safe.
# crsid.sort(key=lambda a: a['last name'])
# Commented out as it breaks script as the pics are NOT alphabetical. von and te are at end.

temp = []


def rename(directory, pattern):

    for index,pathAndFilename in enumerate(sorted(glob.iglob(os.path.join(directory, pattern)))):
        title,ext = os.path.splitext(os.path.basename(pathAndFilename))
        temp.append(title)



        os.rename(pathAndFilename,
                  os.path.join(directory, crsid[index]['username'] + ext))

rename(r'/Users/clow/Desktop/jcsu/scripts/final',r'*.jpg')
